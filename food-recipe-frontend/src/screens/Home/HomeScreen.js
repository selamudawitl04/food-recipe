import React, { useLayoutEffect , useState, useEffect} from "react";
import {ActivityIndicator,   FlatList, Text, View, TouchableHighlight, Image } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryName, getServer } from "../../data/func";

export default function HomeScreen(props) {
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

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="white" onPress={() => onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo_url }} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{getCategoryName(categories, item.categoryId)}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList vertical showsVerticalScrollIndicator={true} numColumns={2} data={recipes} renderItem={renderRecipes} keyExtractor={(item) => `${item.recipeId}`} />
        )
      }
    </View>
  );
}
