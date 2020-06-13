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
    // const params = route.params as Params;

    const [ufs, setUfs] = useState<UF[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [selectedUf, setselectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const [items, setItems] = useState<Item[]>([]);
    const [points, setPoints] = useState<Point[]>([]);
    const [selectedItems, setSelectedItems] = useState<Number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync();
            if (status != 'granted') {
                Alert.alert('Ops!', 'Você precisa permitir acesso a sua localização.');
                return;
            }

            const position = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        };

        loadPosition();
    }, []);

    useEffect(() => {
        api.get('item').then(r => {
            setItems(r.data);
        });
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

    function navigateBack() {
        navigation.goBack(); //volta para a pagina anterior
    };

    function navigatePointDetail(point: Point) {
        navigation.navigate('PointDetail', point);
    };

    function selectItem(id: number) {
        selectedItems.includes(id) ? setSelectedItems(selectedItems.filter(i => i !== id)) : setSelectedItems([...selectedItems, id]);
    }

    function selectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setselectedUf(uf);
    }

    function selectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={navigateBack}>
                    <Icon name="arrow-left" size={20} color="#258294"></Icon>
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de parada.</Text>

                <View style={styles.mapContainer}>
                    {
                        initialPosition[0] !== 0 &&
                        (
                            <Map style={styles.map} loadingEnabled={initialPosition[0] === 0} initialRegion={{
                                latitude: -16.7178895,
                                longitude: -49.3927677,
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
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">UF</label>
                            <select name="uf" id="uf" onChange={selectUf} value={selectedUf} required>
                                <option value="0">Selecione uma UF</option>
                                {
                                    ufs.map(uf => (
                                        <option key={uf.initials} value={uf.initials}>{uf.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="uf">Município</label>
                            <select name="municipio" id="municipio" onChange={selectCity} value={selectedCity}>
                                <option value="0">Selecione um Município</option>
                                {
                                    cities.map(city => (
                                        <option key={city.name} value={city.name}>{city.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <View style={styles.inputCombo}>
                        <TextInput style={styles.input} placeholder="Login" onChange={() => { }} />
                        <TextInput style={styles.input} placeholder="Senha" onChange={() => { }} />
                    </View>

                    <RectButton style={styles.button} onPress={() => { }}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            ENTRAR
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
        // flex: 2,
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