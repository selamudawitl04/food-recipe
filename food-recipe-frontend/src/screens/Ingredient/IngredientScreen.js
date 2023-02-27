import React, { useLayoutEffect, useEffect, useState} from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import { getIngredientUrl, getRecipesByIngredient, getCategoryName, getServer } from "../../data/func";

export default function IngredientScreen(props) {
  const { navigation, route } = props;

  const server = getServer();

  const [isLoading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);

  const [recipes, setRecipe] = useState([]);
  

  const getDatas = async () => {
    try {
      const response = await fetch(`http://${server}/ingredient`);
      const json = await response;
      const ingData = await json.json()
      const response1 = await fetch(`http://${server}/recipes`);
      const json1 = await response1;
      const recipeData = await json1.json()
      const catRespose = await fetch(`http://${server}/categories`)
      const data = await catRespose;
      const categoryData = await data.json()

      setCategories(categoryData)
      setIngredients(ingData);
      setRecipe(recipeData)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  const ingredientId = route.params?.ingredient;
  const ingredientName = route.params?.name;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.name,
    });
  }, []);

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor="white" onPress={() => onPressRecipe(item)}>
      <TouchableHighlight underlayColor="white" onPress={() => onPressRecipe(item)}>
        <View style={styles.container}>
          <Image style={styles.photo} source={{ uri: item.photo_url }} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>{getCategoryName(categories, item.categoryId)}</Text>
        </View>
      </TouchableHighlight>
    </TouchableHighlight>
  );

  return (
    <ScrollView style={styles.mainContainer}>
      {isLoading ? (
          <ActivityIndicator />
        ) :(
      <View style={{ borderBottomWidth: 0.4, marginBottom: 10, borderBottomColor: "grey" }}>
        <Image style={styles.photoIngredient} source={{ uri: "" + getIngredientUrl(ingredients, ingredientId) }} />
      </View>)}
      {isLoading ? (
          <ActivityIndicator />
        ) : (
      <Text style={styles.ingredientInfo}>Recipes with {ingredientName}:</Text>
        )}
        {isLoading ? (
          <ActivityIndicator />
        ) : (
      <View>
        <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={getRecipesByIngredient(recipes, ingredientId)} renderItem={renderRecipes} keyExtractor={(item) => `${item.recipeId + Math.random()*1000}`} />
      </View>
      )}
    
    </ScrollView>
  );
}
