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

interface Servico {
    title: string;
    valor: string;
}

interface Vaga {
    title: string;
    quantidade: number;
}

interface Point {
    id: number;
    imagePerfilUrl: string;
    imagesUrl: string[],
    title: string;
    descricao: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
    city: string;
    uf: string;
    pontos: number[];
    comentarios: string[];
    servicos: Servico[];
    vagas: Vaga[];
}


const PointDetail = () => {
    const navigation = useNavigation(); //para navegar entre as rodas
    const route = useRoute(); //acesso aos dados enviados pela rota anterior
    const params = route.params as Point;

    const [data, setData] = useState<Point>({} as Point);


    useEffect(() => {
        setData(params);
    }, []);

    if (data.id === undefined) {
        //loading
        return null;
    }

    function navigateBack() {
        navigation.goBack(); //volta para a pagina anterior
    };

    function composeWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${data.whatsapp}&text=Tenho interesse sobre coleta de resíduos`);
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image style={styles.pointImage} source={{ uri: data.imagePerfilUrl }}></Image>
            <View style={styles.container}>
                {/* <TouchableOpacity onPress={navigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
                </TouchableOpacity> */}

                <View style={styles.imagesContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                        {
                            data.imagesUrl.map(i => (
                                <Image key={String(i)} style={styles.image} source={{ uri: i }}></Image>
                            ))
                        }
                    </ScrollView>
                </View>

                <ScrollView showsHorizontalScrollIndicator={false}>
                    <Text style={styles.pointName}>{data.title}</Text>
                    <View style={styles.row}>
                        {
                            data.pontos.map(p => (
                                <Icon name="star" size={22} color="#ffc107"></Icon>
                            ))
                        }
                    </View>
                    {/* <Text style={styles.pointItems}>{data.items.map(i=> i.title).join(", ")}</Text> */}

                    <View style={styles.address}>
                        <Text style={styles.addressContent}>{data.city}, {data.uf}</Text>
                        <Text style={styles.addressTitle}>{data.descricao}</Text>
                    </View>

                    {
                        data.servicos.map(s => (
                            <View style={styles.servicos}>
                                <Text style={styles.servicoTitle}>{s.title}</Text>
                                <Text style={styles.servicoValor}>{s.valor}</Text>
                            </View>
                        ))
                    }
                </ScrollView>

            </View>

            <View style={styles.footer}>
                <RectButton onPress={navigateBack} style={styles.button}>
                    <Icon name="arrow-left" size={20} color="#FFF"></Icon>
                    <Text style={styles.buttonText}>Voltar ao mapa</Text>
                </RectButton>
                <RectButton onPress={composeWhatsapp} style={styles.button}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF"></FontAwesome>
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        // paddingTop: 20 + Constants.statusBarHeight,
    },

    scroll: {
        
    },

    row: {
        flexDirection: 'row'
    },

    servicos: {
        backgroundColor: '#FFF',
        marginBottom: 3,
        marginTop: 3,
        paddingHorizontal: 10
    },

    servicoTitle: {
        alignSelf: 'flex-start',
        fontFamily: 'Roboto_500Medium',
        fontSize: 20,
    },

    servicoValor: {
        alignSelf: 'flex-end'
    },

    imagesContainer: {
        flexDirection: 'row',
        // marginTop: 16,
        marginBottom: 32,
    },

    image: {
        backgroundColor: '#fff',
        // borderWidth: 2,
        // borderColor: '#eee',
        height: 120,
        width: 150,
        borderRadius: 5,
        // paddingHorizontal: 1,
        // paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
    },

    pointImage: {
        width: '100%',
        height: 220,
        resizeMode: 'cover',
        // borderRadius: 10,
        // marginTop: 5,
    },

    pointName: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold',
        // marginTop: 15,
    },

    pointItems: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    address: {
        marginTop: 15,
        marginBottom: 15
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
        borderColor: '#f0f0f5',
        backgroundColor: '#f0f0f5',
        paddingVertical: 10,
        paddingHorizontal: 20,
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