const mainData = {
    // Mantenha este objeto vazio ou adicione dados globais aqui, se necessário
}

const clientModel = [
    // Clientes existentes
    {
        id: 1,
        name: "Cliente 1",
        email: "cliente1@example.com",
        address: "Rua 1, 123",
        city: "São Paulo",
        state: "SP",
        zip: "01234-567",
        cpf: "123.456.789-00",
        phone: "(11) 99999-9999",
        rg: "12.345.678-9",
        expeditation: "SSP",
        birthDate: "01/01/1990",
        fatherName: "João da Silva",
        motherName: "Maria da Silva",
        accountType: "Corrente",
        accountNumber: "1234567890",
        agency: "1234",
        bank: "Banco do Brasil",
        registration_benefit: "1234567890",
        sex: "Masculino",
        born_date: "01/01/1990",
        wage: 1000,
        nationality: "Brasileiro",
        inss_password: "123456",
        DDB_date: "01/01/2024",
        password_plataform: "123456",
        client_type: "Pessoa Física",
        contracts: [
            {
                bank: "Banco do Brasil",
                dueDate: "01/01/2024",
                status: "Pendente",
                value_installment: 267.63,
                fees_percentage: 0.1,
                installments: 96,
                installments_paid: 20
            },
            {
                bank: "Caixa Econômica",
                dueDate: "15/02/2024",
                status: "Pago",
                installments: 5,
                value_installment: 398,
                fees_percentage: 0.05,
                installments_paid: 5
            }
        ]
    },
    {
        id: 2,
        name: "Maria Santos",
        email: "maria.santos@example.com",
        address: "Avenida 2, 456",
        city: "Rio de Janeiro",
        state: "RJ",
        zip: "20000-000",
        cpf: "987.654.321-00",
        phone: "(21) 98888-8888",
        rg: "98.765.432-1",
        expeditation: "Detran",
        birthDate: "15/05/1985",
        fatherName: "José Santos",
        motherName: "Ana Santos",
        accountType: "Poupança",
        accountNumber: "0987654321",
        agency: "5678",
        bank: "Caixa Econômica Federal",
        registration_benefit: "0987654321",
        sex: "Feminino",
        born_date: "15/05/1985",
        wage: 2500,
        nationality: "Brasileira",
        inss_password: "654321",
        DDB_date: "15/02/2024",
        password_plataform: "654321",
        client_type: "Pessoa Física",
        contracts: [
            {
                bank: "Santander",
                dueDate: "10/03/2024",
                status: "Pendente",
                installments: 8,
                value_installment: 600,
                fees_percentage: 0.08,
                installments_paid: 3
            }
        ]
    },
    // Novos clientes gerados
    {
        id: 3,
        name: "Carlos Almeida",
        email: "carlos.almeida@example.com",
        address: "Rua 3, 789",
        city: "Curitiba",
        state: "PR",
        zip: "80000-000",
        cpf: "333.222.111-99",
        phone: "(41) 97777-7777",
        rg: "33.222.111-9",
        expeditation: "SSP",
        birthDate: "22/07/1992",
        fatherName: "Paulo Almeida",
        motherName: "Carla Almeida",
        accountType: "Corrente",
        accountNumber: "3344556677",
        agency: "4321",
        bank: "Bradesco",
        registration_benefit: "3344556677",
        sex: "Masculino",
        born_date: "22/07/1992",
        wage: 3200,
        nationality: "Brasileiro",
        inss_password: "334455",
        DDB_date: "20/04/2024",
        password_plataform: "334455",
        client_type: "Pessoa Física",
        contracts: [
            {
                bank: "Itaú",
                dueDate: "20/03/2024",
                status: "Pendente",
                value_installment: 500,
                fees_percentage: 0.07,
                installments: 24,
                installments_paid: 6
            },
            {
                bank: "Banco do Brasil",
                dueDate: "15/05/2024",
                status: "Pago",
                value_installment: 200,
                fees_percentage: 0.06,
                installments: 12,
                installments_paid: 12
            }
        ]
    },
    {
        id: 4,
        name: "Fernanda Costa",
        email: "fernanda.costa@example.com",
        address: "Avenida das Flores, 101",
        city: "Belo Horizonte",
        state: "MG",
        zip: "31000-000",
        cpf: "444.555.666-77",
        phone: "(31) 98888-7777",
        rg: "44.555.666-7",
        expeditation: "Detran",
        birthDate: "10/10/1988",
        fatherName: "Carlos Costa",
        motherName: "Mariana Costa",
        accountType: "Poupança",
        accountNumber: "7766554433",
        agency: "8765",
        bank: "Banco Inter",
        registration_benefit: "7766554433",
        sex: "Feminino",
        born_date: "10/10/1988",
        wage: 2800,
        nationality: "Brasileira",
        inss_password: "778899",
        DDB_date: "10/05/2024",
        password_plataform: "778899",
        client_type: "Pessoa Física",
        contracts: [
            {
                bank: "Santander",
                dueDate: "30/04/2024",
                status: "Pendente",
                value_installment: 700,
                fees_percentage: 0.09,
                installments: 18,
                installments_paid: 10
            },
            {
                bank: "Bradesco",
                dueDate: "25/06/2024",
                status: "Pendente",
                value_installment: 250,
                fees_percentage: 0.04,
                installments: 36,
                installments_paid: 18
            }
        ]
    }
];


export { mainData, clientModel };