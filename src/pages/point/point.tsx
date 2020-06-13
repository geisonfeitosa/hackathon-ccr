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


interface Item {
    id: number;
    title: string;
    imageUrl: string;
};

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
        setInitialPosition([-16.7200086,-49.3990593]);
    }, []);

    useEffect(() => {
        setPoints([
            {
                id: 1,
                image: 'ponto1',
                imageUrl: 'https://images.unsplash.com/photo-1492168732976-2676c584c675?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
                title: 'Ponto 1',
                email: 'ponto1@teste.com',
                whatsapp: '62999999999',
                latitude: -16.7178895,
                longitude: -49.3927677,
                city: 'Goiânia',
                uf: 'GO',
            },
        ]);
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
            <View style={styles.container}>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de parada.</Text>

                <View style={styles.mapContainer}>
                    {
                        initialPosition[0] !== 0 &&
                        (
                            <Map style={styles.map}
                                onPress={() => {}}
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
                                                <Image style={styles.mapMarkerImage} source={{ uri: p.imageUrl }}></Image>
                                                <Text style={styles.mapMarkerTitle}>{p.title}</Text>
                                            </View>
                                        </Marker>
                                    ))
                                }
                            </Map>
                        )
                    }
                </View>

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
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        width: 200
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        width: 220
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
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    inputCombo: {
        marginTop: 15,
        flexDirection: 'row'
    },

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16
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
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
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

export default Point;