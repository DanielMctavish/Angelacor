interface IAdministrator {
    id: string;
    name: string;
    email: string;
    password: string;
    url_profile_cover: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IColaborator extends IAdministrator {
    function: string;
    rankPosition: number;
    salary: number;
    experience: number;
    level: number;
} 