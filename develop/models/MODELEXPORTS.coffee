htmlparse = require('./htmlparse3')
mongoose = require 'mongoose'
models = require('./data').models
mongoose.connect('mongodb://localhost/test')



# urlna = [1669, 1780]
# urleu = [1800, 1911]
latestgamereset = ()->
    htmlparse.queryandretrieve.reset(1669, 1800)

latestgamereset()
htmlparse.queryandretrieve.NA()
htmlparse.queryandretrieve.EU()



exports.resettogame = htmlparse.queryandretrieve.reset#(1669, 1800)
exports.resetlatestgame = latestgamereset#()
exports.queryandretrieveNA = htmlparse.queryandretrieve.NA#()
exports.queryandretrieveEU = htmlparse.queryandretrieve.EU#()