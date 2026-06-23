export const PERMISSIONS = {
    DASHBOARD: {
        VIEW_PAGE: 'dashboard.view.page',
    },
    COMPETENCIAS: {
        VIEW_PAGE: 'competencias.view.page',
        CREATE: 'competencias.create',
        UPDATE: 'competencias.update',
        DELETE: 'competencias.delete',
    },
    SOLUCIONES: {
        VIEW_GRADING_QUEUE: 'soluciones.view.grading',
        GRADE: 'soluciones.grade',
    },
} as const;

export const SYSTEM_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;
