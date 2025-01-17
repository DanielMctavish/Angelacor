export const allClients = [
    {
        name: "Maria José",
        url_profile_cover: "",
        simulation: false,
        proposes: [],
        whatsapp_number: "11999999999",
        email: "maria@email.com"
    },
    {
        name: "João Silva",
        url_profile_cover: "/path/to/photo.jpg",
        simulation: true,
        proposes: [{ id: 1 }, { id: 2 }],
        whatsapp_number: "11988888888",
        email: ""
    },
    {
        name: "Maria Beatriz",
        url_profile_cover: "/path/to/ana.jpg",
        simulation: true,
        proposes: [{ id: 1 }],
        whatsapp_number: "11977777777",
        email: "maria@email.com"
    },
    {
        name: "Carlos Eduardo",
        url_profile_cover: "",
        simulation: false,
        proposes: [],
        whatsapp_number: "11966666666",
        email: "carlos@email.com"
    },
    {
        name: "Patricia Santos",
        url_profile_cover: "/path/to/patricia.jpg",
        simulation: true,
        proposes: [{ id: 1 }, { id: 2 }, { id: 3 }],
        whatsapp_number: "11955555555",
        email: "patricia@email.com"
    },
    {
        name: "Roberto Almeida",
        url_profile_cover: "/path/to/roberto.jpg",
        simulation: true,
        proposes: [{ id: 1 }],
        whatsapp_number: "11944444444",
        email: "roberto@email.com"
    },
    {
        name: "Amanda Costa",
        url_profile_cover: "/path/to/amanda.jpg",
        simulation: false,
        proposes: [],
        whatsapp_number: "",
        email: "amanda@email.com"
    },
    {
        name: "Fernando Souza",
        url_profile_cover: "/path/to/fernando.jpg",
        simulation: true,
        proposes: [{ id: 1 }, { id: 2 }],
        whatsapp_number: "11933333333",
        email: "fernando@email.com"
    }
];

export const stepDescriptions = [
    { text: "Foto de perfil adicionada", xp: 200 },
    { text: "WhatsApp confirmado", xp: 300 },
    { text: "Email confirmado", xp: 600 },
    { text: "Simulação realizada", xp: 1000 },
    { text: "Múltiplas propostas", xp: 1800 }
]; 