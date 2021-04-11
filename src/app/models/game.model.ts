export interface Game {
    id: string;
    name: string;
    movesFEM: string[];
    moves: string[];
    isShowing?: boolean;
    inFavorites?: boolean;
}
