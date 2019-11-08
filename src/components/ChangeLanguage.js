import AsyncStorage from '@react-native-community/async-storage';
export const Language = {
    change: async (language, callback) => {
        try{
            await AsyncStorage.setItem('@appLanguage', language);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    },
    get : async () => {return await AsyncStorage.getItem('@appLanguage')}
}