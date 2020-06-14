import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import Map, { Marker } from 'react-native-maps';
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
        setInitialPosition([-2.6667066, -44.2903607]);
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
                                        <View style={[styles.mapMarkerContainer, p.vagas.length === 0 ? styles.mapMarkerContainerSemVagas : {}]}>
                                            <Image style={styles.mapMarkerImage} source={{ uri: p.imagesUrl[0] }}></Image>
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

    mapMarkerContainerSemVagas: {
        width: 90,
        height: 70,
        backgroundColor: '#fd092a',
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
        imagesUrl: [
            'https://images.unsplash.com/photo-1566399468271-2855a22612a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
            'https://images.unsplash.com/photo-1492168732976-2676c584c675?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1520279406162-c955e67194ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80',
            'https://images.unsplash.com/photo-1559841644-08984562005a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80',
            'https://images.unsplash.com/photo-1515362655824-9a74989f318e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        title: 'Posto KM 300',
        descricao: 'Contamos com amplo local para estacionamento, você pode fazer sua reserva pelo Whatsapp.',
        whatsapp: '5562981257627',
        latitude: -3.185123,
        longitude: -52.197065,
        city: 'Altamira',
        uf: 'PA',
        pontos: [1, 1, 1, 1],
        comentarios: [
            { 
                descricao: 'O local é bem iluminado, me senti seguro lá.',
                autor: 'José da Silva'
            },
            {
                descricao: 'Além de bem iluminado tem segurança noturno, gostei do local.',
                autor: 'Benedito Ribeiro'
            },
            {
                descricao: 'Achei o preço da comida no restaurante um pouco puxado, mas a comida é boa.',
                autor: 'Maria Aparecida'
            }
        ],
        servicos: [
            {
                title: 'Posto de combustível com Dísel',
                valor: ''
            },
            {
                title: 'Estacionamento para Bitrem',
                valor: 'Gratuito'
            },
            {
                title: 'Estacionamento para Carretas',
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
                valor: '50,00 a pernoite'
            },
            {
                title: 'Local para banho',
                valor: 'Gratuito'
            }
        ],
        vagas: [
            {
                title: 'Bitrem',
                quantidade: 5
            },
            {
                title: 'Carreta',
                quantidade: 10
            },
            {
                title: 'Dormitório',
                quantidade: 3
            }
        ],
    },
    {
        id: 2,
        imagesUrl: [
            'https://images.unsplash.com/photo-1582583992248-ea6023bb644c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80',
            'https://images.unsplash.com/photo-1567766176311-a1a2d11a3e35?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
            'https://images.unsplash.com/photo-1517912181842-e5a9d4701a4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=844&q=80',
            'https://images.unsplash.com/photo-1588684682202-ad8a55b23bed?ixlib=rb-1.2.1&auto=format&fit=crop&w=672&q=80',
            'https://images.unsplash.com/photo-1531683760080-7bb28a630bd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80'
        ],
        title: 'Posto Viajante',
        descricao: 'Contamos com local seguro para estacionamento e dormitórios limpos, atendemos pelo Whatsapp.',
        whatsapp: '5562999999999',
        latitude: -3.2013841,
        longitude: -52.2341872,
        city: 'Altamira',
        uf: 'PA',
        pontos: [1, 1],
        comentarios: [
            { 
                descricao: 'O local para estacionamento não é muito grande, mas é bem iluminado.',
                autor: 'Jorge'
            },
            {
                descricao: 'Achei os dormitórios desconfortáveis. Os banheiros também não estavam limpos.',
                autor: 'Benedito da Silva'
            },
            {
                descricao: 'Comida simples e com preço justo.',
                autor: 'Ricardo'
            },
            {
                descricao: 'Poucas vagas para estacionamento, se não tivesse reservado antes teria ficado sem lugar.',
                autor: 'Divina Santos'
            }
        ],
        servicos: [
            {
                title: 'Posto de combustível com Dísel',
                valor: ''
            },
            {
                title: 'Estacionamento para Bitrem',
                valor: 'Gratuito'
            },
            {
                title: 'Estacionamento para Carretas',
                valor: 'Gratuito'
            },
            {
                title: 'Restaurante prato feito',
                valor: '9,99'
            },
            {
                title: 'Lanchonete',
                valor: ''
            },
            {
                title: 'Dormitórios',
                valor: '30,00 a pernoite'
            },
            {
                title: 'Local para banho',
                valor: 'Gratuito'
            }
        ],
        vagas: [
            {
                title: 'Bitrem',
                quantidade: 2
            },
            {
                title: 'Carreta',
                quantidade: 5
            },
            {
                title: 'Dormitório',
                quantidade: 5
            }
        ],
    },
    {
        id: 3,
        imagesUrl: [
            'https://images.unsplash.com/photo-1580621360921-8a51da95e051?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1917&q=80',
            'https://images.unsplash.com/photo-1560871401-c9fd4559b424?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
            'https://images.unsplash.com/photo-1517913451214-e22ce660e086?ixlib=rb-1.2.1&auto=format&fit=crop&w=684&q=80'
        ],
        title: 'Posto 13',
        descricao: 'Contamos com amplo estacionamento seguro e iluminado, reserve seu local pelo Whatsapp.',
        whatsapp: '5562999999999',
        latitude: -3.188661,
        longitude: -52.208484,
        city: 'Altamira',
        uf: 'PA',
        pontos: [1, 1, 1],
        comentarios: [
            { 
                descricao: 'O local para estacionamento realamente é bem iluminado e tem segurança noturno.',
                autor: 'Geovane Rocha'
            },
            {
                descricao: 'Local agradável com banheiros limpos, mas faça reserva antes. Costuma ficar lotado.',
                autor: 'Pereira'
            },
            {
                descricao: 'Não agradei muito da comida, mas o preço justo.',
                autor: 'Felipe Cruz'
            }
        ],
        servicos: [
            {
                title: 'Posto de combustível com Dísel',
                valor: ''
            },
            {
                title: 'Estacionamento para Bitrem',
                valor: 'Gratuito'
            },
            {
                title: 'Estacionamento para Carretas',
                valor: 'Gratuito'
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
            },
            {
                title: 'Local para banho',
                valor: 'Gratuito'
            }
        ],
        vagas: [ ],
    },
    {
        id: 4,
        imagesUrl: [
            'https://images.unsplash.com/photo-1550966286-bf40f4740238?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80',
            'https://images.unsplash.com/photo-1564998736428-caac9f3e2b9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
            'https://images.unsplash.com/photo-1445991842772-097fea258e7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1581234694378-13ebbc5309a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=676&q=80',
            'https://images.unsplash.com/photo-1580497552634-d9a347140ca0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjY1MDE0fQ&auto=format&fit=crop&w=564&q=80'
        ],
        title: 'Posto Tabocão',
        descricao: 'Temos estacionamento para Bitrem e Carretas, tudo bem iluminado e seguro. Reservas e dúvidas pelo Whatsapp.',
        whatsapp: '5562999999999',
        latitude: -2.669011,
        longitude:  -44.289986,
        city: 'São Luiz',
        uf: 'MA',
        pontos: [1, 1, 1, 1],
        comentarios: [
            { 
                descricao: 'Estacionamento bem iluminado e banheiros limpos, gostei.',
                autor: 'Jorge Dias'
            },
            {
                descricao: 'Local bem iluminado e comida boa.',
                autor: 'Augusto Pereira'
            },
            {
                descricao: 'Sempre que passo por São Luiz paro aqui, local seguro e iluminado.',
                autor: 'Fátima'
            },
            {
                descricao: 'Infelizmente não tinha vaga para estacionar.',
                autor: 'Ribeiro'
            }
        ],
        servicos: [
            {
                title: 'Posto de combustível com Dísel',
                valor: ''
            },
            {
                title: 'Estacionamento para Bitrem',
                valor: 'Gratuito'
            },
            {
                title: 'Estacionamento para Carretas',
                valor: 'Gratuito'
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
                valor: '35,00 a pernoite'
            },
            {
                title: 'Local para banho',
                valor: 'Gratuito'
            }
        ],
        vagas: [
            {
                title: 'Bitrem',
                quantidade: 3
            },
            {
                title: 'Carreta',
                quantidade: 2
            },
            {
                title: 'Dormitório',
                quantidade: 5
            }
        ],
    },
]

export default Point;