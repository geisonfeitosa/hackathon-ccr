import React, { useState, useEffect } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import Map, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';


interface Params {
    pointId: number;
}

interface Data {
    point: {
        id: number;
        image: string;
        imageUrl: string;
        title: string;
        email: string;
        whatsapp: string;
        latitude: number;
        longitude: number;
        city: string;
        uf: string;
    };

    items: {
        title: string;
    }[];
}

interface Point {
    id: number;
    image: string;
    imageUrl: string;
    title: string;
    email: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
    city: string;
    uf: string;
}


const PointDetail = () => {
    const navigation = useNavigation(); //para navegar entre as rodas
    const route = useRoute(); //acesso aos dados enviados pela rota anterior
    const params = route.params as Point;

    const [data, setData] = useState<Point>({} as Point);

    useEffect(() => {
        setData(params);
        console.log(data);
    }, []);

    function navigateBack() {
        navigation.goBack(); //volta para a pagina anterior
    };

    function composeMail() {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [data.email]
        });
    }

    function composeWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${data.whatsapp}&text=Tenho interesse sobre coleta de resíduos`);
    }

    if(!data) {
        //loading
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={navigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: data.imageUrl }}></Image>
                <Text style={styles.pointName}>{data.title}</Text>
                {/* <Text style={styles.pointItems}>{data.items.map(i=> i.title).join(", ")}</Text> */}

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{data.city}, {data.uf}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <RectButton onPress={composeWhatsapp} style={styles.button}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF"></FontAwesome>
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>
                <RectButton onPress={composeMail} style={styles.button}>
                    <Icon name="mail" size={20} color="#FFF"></Icon>
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    pointImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 32,
    },

    pointName: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    pointItems: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    address: {
        marginTop: 32,
    },

    addressTitle: {
        color: '#322153',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    addressContent: {
        fontFamily: 'Roboto_400Regular',
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
        paddingVertical: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    button: {
        width: '48%',
        backgroundColor: '#34CB79',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        marginLeft: 8,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Roboto_500Medium',
    },
});

export default PointDetail;