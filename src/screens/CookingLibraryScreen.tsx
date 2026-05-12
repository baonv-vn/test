import { Text } from 'react-native';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { CookingLibraryList } from '../modules/cooking/CookingLibraryList';
import { useRecipeStore } from '../store/recipe.store';

export const CookingLibraryScreen = () => {
  const recipes = useRecipeStore((state) => state.recipes);

  return (
    <ScreenContainer scroll>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>Thư viện Cooking</Text>
      <CookingLibraryList recipes={recipes} />
    </ScreenContainer>
  );
};
