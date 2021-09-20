export interface Move {
    from: string;
    to: string;
}

export interface Game {
    id: string;
    uidUser?: string;
    name: string;
    nameFrom?: string;
    movesFEN: string[];
    moves: Move[];
    movesHuman?: string;
    movesHumanHistoryRow?: string[];
    isShowing?: boolean;
    inFavorites?: boolean;
    currentMoveNumber?: number;
    orientation?: 'w' | 'b';
    syncFirestore?: boolean;
}
