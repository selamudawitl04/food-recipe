import React, { useLayoutEffect , useState, useEffect} from "react";
import { ActivityIndicator, FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import { getNumberOfRecipes, getServer } from "../../data/func";
import MenuImage from "../../components/MenuImage/MenuImage";

export default function CategoriesScreen(props) {
  const { navigation } = props;
  const server = getServer();

  const [isLoading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);

  const getDatas = async () => {
    try {
      const response = await fetch(`http://${server}/recipes`);
      const json = await response;
      const recipeData = await json.json()
      const catRespose = await fetch(`http://${server}/categories`)
      const data = await catRespose;
      const categoryData = await data.json()

      setCategories(categoryData)
      setRecipes(recipeData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
      },
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const onPressCategory = (item) => {
    const title = item.name;
    const category = item;
    navigation.navigate("RecipesList", { category, title });
  };

  const renderCategory = ({ item }) => (
    <TouchableHighlight underlayColor="white" onPress={() => onPressCategory(item)}>
      <View style={styles.categoriesItemContainer}>
        <Image style={styles.categoriesPhoto} source={{ uri: item.photo_url }} />
        <Text style={styles.categoriesName}>{item.name}</Text>
        <Text style={styles.categoriesInfo}>{getNumberOfRecipes(recipes, item.id)} recipes</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      {isLoading ? (
          <ActivityIndicator />
        ) : (
      <FlatList data={categories} renderItem={renderCategory} keyExtractor={(item) => `${item.id}`} />
        )}
    </View>
  );
}
