const { Player } = require('../data/Player.js');

class PlayerManager {
    constructor(database) {
        this.players = [];
        this.connection = database;
    }

    init(){
        this.connection.query(`SELECT * FROM cw_players;`).then((res) => {
            res.rows.forEach((row) => {
                this.addPlayer(new Player(row.id, row.username, this));
            });
        }).catch((err) => {
            console.log(err);
        });
    }
    
    addPlayer(player) {
        this.players.push(player);
    }
    
    getPlayer(id) {
        return this.players.find((player) => player.id === id);
    }

    registerPlayer(id, username) {
        this.connection.registerPlayer(id, username);
        this.addPlayer(new Player(id, username, this));
    }

    removePlayer(id) {
        const player = this.getPlayer(id);
        if (!player) return;
        this.players.splice(this.players.indexOf(player), 1);
        this.connection.query(`DELETE FROM cw_players WHERE id = $1;`, [id]).then(() => {
            console.log('Player removed');
        }).catch((err) => {
            console.log(err);
        });
    }

    async savePlayer(id) {
        const player = this.getPlayer(id);
        await player.save();
    }

    async saveAll() {
        this.players.forEach(async (player) => {
            await player.save();
        });
    }
}

module.exports = { PlayerManager };