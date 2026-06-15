export interface RankingUser {
    position: number;
    name: string;
    username: string;
    points: number;
    solvedProblems: number;
    competitions: number;
    trend: 'up' | 'down' | 'stable';
    userId: number;
}

export interface RankingResponse {
    ranking: RankingUser[];
    totalUsers: number;
}

export interface MyRankingStats {
    position: number;
    points: number;
    solvedProblems: number;
    competitions: number;
    totalUsers: number;
}
