import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import styles from "./styles";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  getIngredientName,
  getCategoryName,
  getCategoryById,
  getServer
} from "../../data/func";
import BackButton from "../../components/BackButton/BackButton";
import ViewIngredientsButton from "../../components/ViewIngredientsButton/ViewIngredientsButton";
// import AsyncStorage from 'react-native-community';

const { width: viewportWidth } = Dimensions.get("window");

export default function RecipeScreen(props) {
  const { navigation, route } = props;
  const  server = getServer();

  const [isLoading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [bookmark, setbookmark] = useState(false);

  const getDatas = async () => {
    try {
      const response = await fetch(`http://${server}/ingredient`);
      const json = await response;
      const recipeData = await json.json()
      const catRespose = await fetch(`http://${server}/categories`)
      const data = await catRespose;
      const categoryData = await data.json()

      setCategories(categoryData)
      setIngredients(recipeData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveBookMark = async res_id => {
    setbookmark(true); 
    await AsyncStorage.getItem('bookmark').then(token => {
        const res = JSON.parse(token);
        if (res !== null) {
            let data = res.find(value => value === res_id);
            if (data == null) {
                res.push(res_id);
                AsyncStorage.setItem('bookmark', JSON.stringify(res));
                alert('Your bookmarked a recipie');
            }
        } else {
            let bookmark = [];
            bookmark.push(res_id);
            AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));
            alert('Your bookmarked a recipie');
        }
    });
};

const removeBookMark = async res_id => {
  setbookmark(false);
  const bookmark = await AsyncStorage.getItem('bookmark').then(token => {
      const res = JSON.parse(token);
      return res.filter(e => e !== res_id);
  });
  await AsyncStorage.setItem('bookmark', JSON.stringify(bookmark));
  alert('Your unbookmarked a recipie');
};

const renderBookMark = async res_id => {
       await AsyncStorage.getItem('bookmark').then(token => {
           const res = JSON.parse(token);
           if (res != null) {
               let data = res.find(value => value === res_id);
               return data == null ? setbookmark(false) : setbookmark(true);
           }
       });
   };
   
   const item = route.params?.item;

  useEffect(() => {
    getDatas();
    // renderBookMark(item);
  }, []);
  
  

  const [activeSlide, setActiveSlide] = useState(0);
  const slider1Ref = useRef();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: "true",
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const renderImage = ({ item }) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item }} />
      </View>
    </TouchableHighlight>
  );

  const onPressIngredient = (item) => {
    var name = getIngredientName(ingredients, item);
    let ingredient = item;
    navigation.navigate("Ingredient", { ingredient, name });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <View style={styles.carousel}>
          <Carousel
            ref={slider1Ref}
            data={item.photosArray}
            renderItem={renderImage}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            firstItem={0}
            loop={false}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={(index) => setActiveSlide(0)}
          />
          <Pagination
            dotsLength={item.photosArray.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotColor="rgba(255, 255, 255, 0.92)"
            dotStyle={styles.paginationDot}
            inactiveDotColor="white"
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={slider1Ref.current}
            tappableDots={!!slider1Ref.current}
          />
        </View>
      </View>
      <View style={styles.infoRecipeContainer}>
        <Text style={styles.infoRecipeName}>{item.title}</Text>
        <View style={styles.infoContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableHighlight
          
            onPress={() =>
              navigation.navigate("RecipesList", { category, title })
            }
          >
            <Text style={styles.category}>
              {getCategoryName(item.categoryId).toUpperCase()}
            </Text>
          </TouchableHighlight>)}
        </View>

        <View style={styles.infoContainer}>
          <Image
            style={styles.infoPhoto}
            source={require("../../../assets/icons/time.png")}
          />
          <Text style={styles.infoRecipe}>{item.time} minutes </Text>
        </View>

        <View style={styles.infoContainer}>
          <ViewIngredientsButton
            onPress={() => {
              let ingredients = item.ingredients;
              let title = "Ingredients for " + item.title;
              navigation.navigate("IngredientsDetails", { ingredients, title });
            }}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoDescriptionRecipe}>{item.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
