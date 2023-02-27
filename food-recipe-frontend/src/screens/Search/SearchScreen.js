import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, Image, TouchableHighlight, Pressable } from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryName, getRecipesByRecipeName, getRecipesByCategoryName, getRecipesByIngredientName, getServer } from "../../data/func";
import { TextInput } from "react-native-gesture-handler";

export default function SearchScreen(props) {
  const { navigation } = props;

  const [value, setValue] = useState("");
  const [data, setData] = useState([]);

  const server = getServer();

  const [isLoading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);


  const getDatas = async () => {
    try {
      const response = await fetch(`http://${server}/recipes`);
      const json = await response;
      const recipeData = await json.json()
      const catRespose = await fetch(`http://${server}/categories`)
      const data = await catRespose;
      const categoryData = await data.json()
      const ingRespose = await fetch(`http://${server}/categories`)
      const ingData = await ingRespose;
      const ingredientData = await ingData.json()


      setCategories(categoryData)
      setRecipes(recipeData);
      setIngredients(ingredientData)
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
      headerTitle: () => (
        <View style={styles.searchContainer}>
          <Image style={styles.searchIcon} source={require("../../../assets/icons/search.png")} />
          <TextInput
            style={styles.searchInput}
            onChangeText={handleSearch}
            value={value}
          />
          <Pressable onPress={() => handleSearch("")}>
          <Image style={styles.searchIcon} source={require("../../../assets/icons/close.png")} />
          </Pressable>
        </View>
      ),
      headerRight: () => <View />,
    });
  }, [value]);

  useEffect(() => {}, [value]);

  const handleSearch = (text) => {
    setValue(text);
    if (!Array.isArray(recipes)){
      return
    }
    var recipeArray1 = getRecipesByRecipeName(recipes, text);
    var recipeArray2 = getRecipesByCategoryName(categories, text);
    var recipeArray3 = getRecipesByIngredientName(ingredients, text);
    var aux = recipeArray1.concat(recipeArray2);
    var recipeArray = [...new Set(aux)];

    if (text == "") {
      setData([]);
    } else {
      setData(recipeArray);
    }
  };

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
      <FlatList vertical showsVerticalScrollIndicator={false} numColumns={2} data={data} renderItem={renderRecipes} keyExtractor={(item) => `${item.recipeId}`} />
        )}
    </View>
  );
}
