import React, { useEffect, useState , useLayoutEffect } from "react";
import { ActivityIndicator, FlatList, Text, View, TouchableHighlight, Image } from "react-native";
import styles from "./styles";
import { getRecipes, getCategoryName, getServer } from "../../data/func";

export default function RecipesListScreen(props) {
  const { navigation, route } = props;

  const item = route?.params?.category;
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
  // const recipesArray = getRecipes(recipes, item.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title,
      headerRight: () => <View />,
    });
  }, []);

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };11112222333344445555666677778888

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
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={getRecipes(recipes, item.id)} renderItem={renderRecipes} keyExtractor={(item) => `${item.recipeId + Math.random()*100}`} />
        )}
    </View>
  );
}
