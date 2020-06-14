import React, { useEffect, useState, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ScrollView, TextInput, RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import Map, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import api from '../../services/api';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


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

interface Params {
    city: string;
    uf: string;
}

interface UF {
    initials: string,
    name: string
}

interface City {
    uf: string,
    name: string
}


const Point = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [ufs, setUfs] = useState<UF[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const [points, setPoints] = useState<Point[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    // useEffect(() => {
    //     async function loadPosition() {
    //         const { status } = await Location.requestPermissionsAsync();
    //         if (status != 'granted') {
    //             Alert.alert('Ops!', 'Você precisa permitir acesso a sua localização.');
    //             return;
    //         }

    //         const position = await Location.getCurrentPositionAsync();
    //         const { latitude, longitude } = position.coords;
    //         setInitialPosition([latitude, longitude]);
    //     };

    //     loadPosition();
    // }, []);

    useEffect(() => {
        setInitialPosition([-16.7200086, -49.3990593]);
    }, []);

    useEffect(() => {
        setPoints(POINS);
    }, []);

    useEffect(() => {
        setSelectedUf('0');
        setSelectedCity('0');
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

    function navigateBack() {
        navigation.goBack();
    };

    function navigateLoation() {
        setInitialPosition([-3.198670, -52.236628]);
    };

    function navigatePointDetail(point: Point) {
        navigation.navigate('PointDetail', point);
    };

    function setUf(uf: string) {
        setSelectedUf(uf);
        setSelectedCity('0');
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.mapContainer}>
                {/* <Text style={styles.title}>Pontos de Apoio</Text> */}
                {
                    initialPosition[0] !== 0 &&
                    (
                        <Map style={styles.map}
                            onPress={() => { }}
                            key={initialPosition[0]}
                            loadingEnabled={initialPosition[0] === 0}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.015
                            }}>
                            {
                                points.map(p => (
                                    <Marker key={p.id} coordinate={{
                                        latitude: p.latitude,
                                        longitude: p.longitude
                                    }} onPress={() => navigatePointDetail(p)}>
                                        <View style={styles.mapMarkerContainer}>
                                            <Image style={styles.mapMarkerImage} source={{ uri: p.imagePerfilUrl }}></Image>
                                            <Text style={styles.mapMarkerTitle}>{p.title}</Text>
                                        </View>
                                    </Marker>
                                ))
                            }
                        </Map>
                    )
                }
            </View>
            <View style={styles.containerFilter}>
                <View>
                    <View style={styles.inputCombo}>
                        <View>
                            <RNPickerSelect style={pickerStyleUf} placeholder={{ label: 'UF' }}
                                onValueChange={(value) => setUf(value)}
                                items={ufs.map(u => ({
                                    label: u.name,
                                    value: u.initials
                                }))}
                            />
                        </View>
                        <View>
                            <RNPickerSelect style={pickerStyleCity} placeholder={{ label: 'Município' }}
                                onValueChange={(value) => setSelectedCity(value)}
                                items={cities.map(c => ({
                                    label: `${c.name} - ${c.uf}`,
                                    value: c.name
                                }))}
                            />
                        </View>
                    </View>

                    <RectButton style={styles.button} onPress={navigateLoation}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            IR PARA MUNICÍPIO
                    </Text>
                    </RectButton>
                </View>
            </View>
            {/* <View style={styles.itemsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {
                        items.map(i => (
                            <TouchableOpacity key={String(i.id)} style={[styles.item, selectedItems.includes(i.id) ? styles.selectedItem : {}]} activeOpacity={0.5} onPress={() => selectItem(i.id)}>
                                <SvgUri width={42} height={42} uri={i.imageUrl}></SvgUri>
                                <Text style={styles.itemTitle}>{i.title}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View> */}
        </SafeAreaView>
    );
};

const pickerStyleCity = {
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        width: 200
    },

    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        width: 250
    }
}

const pickerStyleUf = {
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        width: 100
    },

    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        marginRight: 10,
        paddingHorizontal: 24,
        fontSize: 16,
        width: 100
    }
}

const styles = StyleSheet.create({

    containerFilter: {
        flex: 1,
        paddingHorizontal: 15
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24
    },

    inputCombo: {
        marginTop: 15,
        flexDirection: 'row'
    },

    button: {
        backgroundColor: '#258294',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 15
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 3,
        paddingTop: Constants.statusBarHeight,
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

const POINS: Point[] = [
    {
        id: 1,
        imagePerfilUrl: 'https://images.unsplash.com/photo-1566399468271-2855a22612a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
        imagesUrl: [
            'https://images.unsplash.com/photo-1492168732976-2676c584c675?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1520279406162-c955e67194ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80',
            'https://images.unsplash.com/photo-1559841644-08984562005a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80',
            'https://images.unsplash.com/photo-1515362655824-9a74989f318e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        title: 'Posto KM 300',
        descricao: 'Contamos com amplo local para estacionamento, você pode fazer sua reserva pelo Whatsapp.',
        whatsapp: '62999999999',
        latitude: -16.7178895,
        longitude: -49.3927677,
        city: 'Goiânia',
        uf: 'GO',
        pontos: [1, 1, 1, 1],
        comentarios: [
            'O local é bem iluminado, me senti seguro lá.',
            'Além de bem iluminado tem segurança noturno, gostei do local.',
            'Achei o preço da comida no restaurante um pouco puchado, mas a comida é boa.'
        ],
        servicos: [
            {
                title: 'Estacionamento para Bitrem',
                valor: 'Gratuito'
            },
            {
                title: 'Estacionamento para vanderleia',
                valor: 'Gratuito'
            },
            {
                title: 'Restaurante por Kg',
                valor: '19,00'
            },
            {
                title: 'Restaurante prato feito',
                valor: '10,00'
            },
            {
                title: 'Lanchonete',
                valor: ''
            },
            {
                title: 'Dormitórios',
                valor: '30,00 a pernoite'
            }
        ],
        vagas: [
            {
                title: 'Bitrem',
                quantidade: 9
            },
            {
                title: 'Vanderleia',
                quantidade: 5
            },
            {
                title: 'Dormitório',
                quantidade: 3
            }
        ],
    },
]

export default Point;