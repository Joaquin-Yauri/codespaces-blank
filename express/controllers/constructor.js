import constructorModel from '../models/constructors.js';

const getConstructors = (req, res) => {
    try {
        const constructors = constructorModel.getConstructors();
        const constructorWithLinks = constructors.map((constructor) => ({
            ...constructor,
            links: [
                {
                    rel:'self',
                    href: `/api/v1/constructors/${constructor.id}`
                },
                {
                    rel:'self',
                    href: `/api/v1/records?constructor_id=${constructor.id}`
                }
            ]
        }));
        res.status(200).json({
            message: 'Constructor retrieved successfully',
            count: constructorWithLinks.length,
            data: constructorWithLinks,
            links: [
                {
                    rel:'self',
                    href: '/api/v1/constructors'
                }
            ]
        });
    } catch(error) {
        res.status(500).json({
            message: 'Failed to retrieve constructors',
            error: error.message
        });
    };
}

export { getConstructors };