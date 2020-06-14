import React from 'react';
import { View, ImageBackground, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';



const Home = () => {
    const navigation = useNavigation();

    function navigatePoint() {
        navigation.navigate('Point');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ImageBackground source={require('../../../assets/background.jpg')} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <View style={styles.main}>
                        <View style={{ alignItems: 'center' }}>
                            <Image style={styles.logo} source={require("../../../assets/logo.png")} />
                            <Text style={styles.title}>Aplicativo feito para você caminhoneiro</Text>
                        </View>
                    </View>

                    <View>
                        <TouchableHighlight
                            style={styles.submit}
                            onPress={navigatePoint}
                            underlayColor='#ffffff4d'>
                            <Text style={styles.submitText}>ENTRAR</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView >
    );
};

const pickerStyle = {
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: '#119ebcb5'
    },

    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch'
    },

    logo: {
        resizeMode: 'contain',
        height: 200
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#FFF',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    submit: {
        height: 60,
        flexDirection: 'row',
        borderRadius: 30,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#fff',
    },

    submitText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 18,
    },

});
export default Home;