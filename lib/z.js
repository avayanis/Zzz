/**
 * Zees Includes
 */
var ZzzServer	= require("./server");

module.exports = {

    createServer : function() {
        return new ZzzServer();
    },

    Server : ZzzServer
}