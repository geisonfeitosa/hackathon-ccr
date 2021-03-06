import React, { useState, useEffect } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import Map, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';


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

interface Comentario {
    descricao: string;
    autor: string;
}

interface Point {
    id: number;
    imagesUrl: string[],
    title: string;
    descricao: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
    city: string;
    uf: string;
    pontos: number[];
    comentarios: Comentario[];
    servicos: Servico[];
    vagas: Vaga[];
}


const PointDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as Point;

    const [data, setData] = useState<Point>({} as Point);
    const [imageUrlPrincipal, setImageUrlPrincipal] = useState<String>('');


    useEffect(() => {
        setData(params);
    }, []);

    useEffect(() => {
        if (data.imagesUrl !== undefined) {
            selectedImageUrlPrincipal(data.imagesUrl[0]);
        }
    }, [data.imagesUrl]);

    if (data.id === undefined) {
        //loading
        return null;
    }

    function selectedImageUrlPrincipal(imageUrl: String) {
        setImageUrlPrincipal(imageUrl);
    }

    function navigateBack() {
        navigation.goBack();
    }

    function composeWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${data.whatsapp}`);
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image style={styles.pointImage} source={{ uri: String(imageUrlPrincipal) }}></Image>
            <View style={styles.container}>
                <View style={styles.imagesContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                        {
                            data.imagesUrl.map(i => (
                                <TouchableOpacity key={String(i)} onPress={() => selectedImageUrlPrincipal(i)}>
                                    <Image style={styles.image} source={{ uri: i }}></Image>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>

                <View style={styles.header}>
                    <View>
                        <Text style={styles.pointName}>{data.title}</Text>
                        <View style={styles.row}>
                            {
                                data.pontos.map(p => (
                                    <Icon name="star" size={22} color="#ffc107"></Icon>
                                ))
                            }
                        </View>
                    </View>

                    <View style={[styles.temosVagas, data.vagas.length === 0 ? styles.lotado : {}]}>
                        <Text style={styles.temosVagasLabel}>{(data.vagas.length != 0 ? 'Estacionamento com Vagas' : 'Estacionamento Lotado')}</Text>
                    </View>
                </View>

                <ScrollView showsHorizontalScrollIndicator={false}>
                    <View style={styles.address}>
                        <Text style={styles.addressContent}>{data.city}, {data.uf}</Text>
                        <Text style={styles.addressTitle}>{data.descricao}</Text>
                        {
                            data.vagas.map(v => (
                                <Text style={styles.vaga}>{`${v.quantidade} vagas ${v.title} disponíveis.`}</Text>
                            ))
                        }
                    </View>

                    <View>
                        <Text style={styles.addressTitle}>Serviços:</Text>
                        {
                            data.servicos.map(s => (
                                <View style={styles.servico}>
                                    <Text style={styles.servicoTitle}>{s.title}</Text>
                                    <Text style={styles.servicoValor}>{s.valor}</Text>
                                </View>
                            ))
                        }
                    </View>

                    <View style={styles.comentarios}>
                        <Text style={styles.addressTitle}>Comentários:</Text>
                        {
                            data.comentarios.map(c => (
                                <View style={styles.comentario}>
                                    <Text style={styles.comentarioDescricao}>{c.descricao}</Text>
                                    <Text style={styles.servicoValor}>{c.autor}</Text>
                                </View>
                            ))
                        }
                    </View>

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
        padding: 15
    },

    vaga: {
        color: '#322153',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16
    },

    lotado: {
        backgroundColor: '#fd092a',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        alignSelf: 'flex-end',
        alignItems: 'center',
        width: 135,
        marginVertical: 10
    },

    temosVagas: {
        backgroundColor: '#34CB79',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        alignSelf: 'flex-end',
        alignItems: 'center',
        width: 135,
        marginVertical: 10
    },

    temosVagasLabel: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        color: '#FFF'
    },

    row: {
        flexDirection: 'row'
    },

    servico: {
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

    comentarios: {
        marginTop: 15
    },

    comentario: {
        borderTopWidth: 1,
        borderBottomColor: '#258294',
        paddingHorizontal: 10,
        paddingVertical: 5
    },

    comentarioDescricao: {
        alignSelf: 'flex-start',
        fontFamily: 'Roboto_500Medium',
        fontSize: 18
    },

    imagesContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },

    image: {
        backgroundColor: '#fff',
        height: 70,
        width: 120,
        borderRadius: 5,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
    },

    pointImage: {
        width: '100%',
        height: 220,
        resizeMode: 'cover'
    },

    pointName: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold'
    },

    pointItems: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    address: {
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

    header: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f5',
        backgroundColor: '#f0f0f5',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    button: {
        width: '48%',
        backgroundColor: '#258294',
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