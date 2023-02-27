import React, { useEffect, useState, useLayoutEffect } from "react";
import { ActivityIndicator, FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import { getIngredientName, getAllIngredients, getServer } from "../../data/func";

export default function IngredientsDetailsScreen(props) {
  const { navigation, route } = props;
  const server = getServer();

  const [isLoading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);

  const getDatas = async () => {
    try {
      const response = await fetch(`http://${server}/ingredient`);
      const json = await response;
      const recipeData = await json.json()

      setIngredients(recipeData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  const item = route.params?.ingredients;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title,
      headerTitleStyle: {
        fontSize: 16,
      },
    });
  }, []);

  const onPressIngredient = (item) => {
    let name = getIngredientName(ingredients, item.ingredientId);
    let ingredient = item.ingredientId;
    navigation.navigate("Ingredient", { ingredient, name });
  };

  const renderIngredient = ({ item }) => (
    <TouchableHighlight underlayColor="white" onPress={() => onPressIngredient(item[0])}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item[0].photo_url }} />
        <Text style={styles.title}>{item[0].name}</Text>
        <Text style={{ color: "grey" }}>{item[1]}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View>
      {isLoading ? (
          <ActivityIndicator />
        ) :(
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={3} data={getAllIngredients(ingredients, item)} renderItem={renderIngredient} keyExtractor={(item) => `${item.recipeId * Math.random()*1000}`} />
        )}
    </View>
  );
}
