import axios from 'axios';

class XpSystem {
    static levels = {
        level1: 0,      // 1.2k  - Inicial
        level2: 3600,   // 3.6k  (+2.4k)
        level3: 7200,   // 7.2k  (+3.6k)
        level4: 12000,  // 12k   (+4.8k)
        level5: 18000,  // 18k   (+6k)
        level6: 25200,  // 25.2k (+7.2k)
        level7: 33600,  // 33.6k (+8.4k)
        level8: 43200,  // 43.2k (+9.6k)
        level9: 54000,  // 54k   (+10.8k)
        level10: 66000, // 66k   (+12k)
        level11: 79200, // 79.2k (+13.2k)
        level12: 93600, // 93.6k (+14.4k)
        level13: 109200,// 109.2k (+15.6k)
        level14: 126000,// 126k  (+16.8k)
        level15: 144000,// 144k  (+18k)
        level16: 163200,// 163.2k (+19.2k)
        level17: 183600,// 183.6k (+20.4k)
        level18: 205200,// 205.2k (+21.6k)
        level19: 228000,// 228k  (+22.8k)
        level20: 252000 // 252k  (+24k) - Master
    };

    static async GiveColaboratorXp(colaboratorId, xp) {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            const colaboratorData = JSON.parse(localStorage.getItem('colaboratorData'));
            const token = adminData?.token || colaboratorData?.token;

            if (!token) {
                throw new Error('Token não encontrado');
            }

            // Primeiro busca o colaborador para pegar a experiência atual
            const colaboratorResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/colaborator/find?colaboratorId=${colaboratorId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Calcula a nova experiência
            const currentExperience = colaboratorResponse.data.experience || 0;
            const newExperience = currentExperience + xp;

            // Atualiza com o novo valor total
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/colaborator/update?colaboratorId=${colaboratorId}`,
                { experience: newExperience },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar XP:', error);
            throw error;
        }
    }

    static async RemoveColaboratorXp(colaboratorId, experience) {
        try {
            const adminData = JSON.parse(localStorage.getItem('adminToken'));
            if (!adminData?.token) {
                throw new Error('Token de administrador não encontrado');
            }

            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/colaborator/update?colaboratorId=${colaboratorId}`,
                { experience: -experience }, // Enviando valor negativo com o nome correto do campo
                {
                    headers: {
                        'Authorization': `Bearer ${adminData.token}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Erro ao remover XP:', error);
            throw error;
        }
    }

    // Método auxiliar para calcular o nível atual baseado no XP
    static getCurrentLevel(experience) {
        const levels = Object.entries(this.levels);
        for (let i = levels.length - 1; i >= 0; i--) {
            if (experience >= levels[i][1]) {
                return {
                    level: i + 1,
                    currentXp: experience,
                    nextLevelXp: levels[i + 1]?.[1] || levels[i][1],
                    xpNeeded: (levels[i + 1]?.[1] || levels[i][1]) - experience
                };
            }
        }
        return { 
            level: 1, 
            currentXp: experience, 
            nextLevelXp: levels[1][1], 
            xpNeeded: levels[1][1] - experience 
        };
    }
}

export default XpSystem;