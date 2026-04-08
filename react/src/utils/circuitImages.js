const circuitImages = {
    1: '/images/circuits/1.jpg',
    2: '/images/circuits/2.jpg',
    3: '/images/circuits/3.jpg',
    4: '/images/circuits/4.jpg',
    5: '/images/circuits/5.jpg',
    6: '/images/circuits/6.jpg',
    7: '/images/circuits/7.jpg',
    8: '/images/circuits/8.jpg',
    9: '/images/circuits/9.jpg',
    10: '/images/circuits/10.jpg',
    11: '/images/circuits/11.jpg',
    12: '/images/circuits/12.jpg',
    13: '/images/circuits/13.jpg',
    14: '/images/circuits/14.jpg',
    15: '/images/circuits/15.jpg',
    16: '/images/circuits/16.jpg',
    17: '/images/circuits/17.jpg',
    18: '/images/circuits/18.jpg',
    19: '/images/circuits/19.jpg',
    20: '/images/circuits/20.jpg',
    21: '/images/circuits/21.jpg',
    22: '/images/circuits/22.jpg',
    23: '/images/circuits/23.jpg',
    24: '/images/circuits/24.jpg'
};

const getCircuitImage = (circuitId) => {
    return circuitImages[circuitId];
};

export { getCircuitImage };