export type ServerStatus = {
    data: {
        type: string,
        id: string,
        attributes: {
            status: 'online' | 'offline'
        },
    },
    relationships: {},
    included: [
        {
            attributes: {
                name: string
            }
        }
    ]
}
