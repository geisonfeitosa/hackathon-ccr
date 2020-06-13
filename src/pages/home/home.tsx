import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton, TextInput, TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface UF {
    initials: string,
    name: string
}

interface City {
    uf: string,
    name: string
}

const Home = () => {
    const [ufs, setUfs] = useState<UF[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const navigation = useNavigation();

    function navigatePoint() {
        navigation.navigate('Point');
    };

    function setUf(uf: string) {
        setSelectedUf(uf);
        setSelectedCity('0');
    }

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then((r: any) => {
            const ufsRet = r.data.map((i: any) => ({ initials: i.sigla, name: i.nome }));
            setUfs(ufsRet);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === '0') return;
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`).then((r: any) => {
            const citiesRet = r.data.map((i: any) => ({ uf: i.microrregiao.mesorregiao.UF.sigla, name: i.nome }));
            setCities(citiesRet);
        });
    }, [selectedUf]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ImageBackground source={require('../../../assets/background.jpg')} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <View style={styles.main}>
                        <Text>logo</Text>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.title}>Aplicativo feito para você caminhoneiro</Text>
                            {/* <Text style={styles.description}>Subtitulo.</Text> */}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableHighlight
                            style={styles.submit}
                            onPress={navigatePoint}
                            underlayColor='#ffffff4d'>
                            <Text style={styles.submitText}>ENTRAR</Text>
                        </TouchableHighlight>
                        {/* <RectButton style={styles.button} onPress={navigatePoint} >
                            <View style={styles.buttonIcon}>
                                <Text>
                                    <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                                </Text>
                            </View>
                        <Text style={styles.buttonText}>
                            ENTRAR
                            </Text>
                        </RectButton> */}
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
        alignSelf: 'stretch',
        // width: null,
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

    footer: {},

    select: {},

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