mongoose = require 'mongoose'
models = require('./data').models

players = {
    Cruzerthebruzer: ['top', 'Dignitas']
    Crumbzz: ['jungle', 'Dignitas']
    Scarra: ['mid', 'Dignitas']
    Imaqtpie: ['adc', 'Dignitas']
    KiWiKiD: ['support', 'Dignitas']
    Balls: ['top', 'Cloud 9']
    Meteos: ['jungle', 'Cloud 9']
    Hai: ['mid', 'Cloud 9']
    Sneaky: ['adc', 'Cloud 9']
    LemonNation: ['support', 'Cloud 9']
    Dyrus: ['top', 'TSM']
    TheOddOne: ['jungle', 'TSM']
    Bjergsen: ['mid', 'TSM']
    WildTurtle: ['adc', 'TSM']
    Xpecial: ['support', 'TSM']
    Nien: ['top', 'CLG']
    Link: ['jungle', 'CLG']
    HotshotGG: ['mid', 'CLG']
    Doublelift: ['adc', 'CLG']
    Aphromoo: ['support', 'CLG']
    Innox: ['top', 'Evil Geniuses']
    Snoopeh: ['jungle', 'Evil Geniuses']
    Pobelter: ['mid', 'Evil Geniuses']
    Yellowpete: ['adc', 'Evil Geniuses']
    Krepo: ['support', 'Evil Geniuses']
    Benny: ['top', 'XDG']
    Zuna: ['jungle', 'XDG']
    mancloud: ['mid', 'XDG']
    Xmithie: ['adc', 'XDG']
    BloodWater: ['support', 'XDG']
    ZionSpartan: ['top', 'Coast']
    NintendudeX: ['jungle', 'Coast']
    Shiphtur: ['mid', 'Coast']
    WizFujiiN: ['adc', 'Coast']
    Daydreamin: ['support', 'Coast']
    Quas: ['top', 'Curse']
    IWillDominate: ['jungle', 'Curse']
    Voyboy: ['mid', 'Curse']
    Cop: ['adc', 'Curse']
    Zekent: ['support', 'Curse']
    Wickd: ['top', 'Alliance']
    Shook: ['jungle', 'Alliance']
    Froggen: ['mid', 'Alliance']
    Tabzz: ['adc', 'Alliance']
    Nyph: ['support', 'Alliance']
    sOAZ: ['top', 'Fnatic']
    Cyanide: ['jungle', 'Fnatic']
    xPeke: ['mid', 'Fnatic']
    Rekkles: ['adc', 'Fnatic']
    YellOwStaR: ['support', 'Fnatic']
    Kev1n: ['top', 'Millenium']
    Araneae: ['jungle', 'Millenium']
    Kerp: ['mid', 'Millenium']
    Creaton: ['adc', 'Millenium']
    Jree: ['support', 'Millenium']
    Xaxus: ['top', 'ROCCAT']
    Jankos: ['jungle', 'ROCCAT']
    Overpow: ['mid', 'ROCCAT']
    Celaver: ['adc', 'ROCCAT']
    VandeR: ['support', 'ROCCAT']
    Darien: ['top', 'Gambit']
    Diamond: ['jungle', 'Gambit']
    'Alex Ich': ['mid', 'Gambit']
    Genja: ['adc', 'Gambit']
    EDward: ['support', 'Gambit']
    fredy122: ['top', 'SK Gaming']
    Svenskeren: ['jungle', 'SK Gaming']
    Jesiz: ['mid', 'SK Gaming']
    CandyPanda: ['adc', 'SK Gaming']
    nRated: ['support', 'SK Gaming']
    YoungBuck: ['top', 'Copenhagen Wolves']
    Amazing: ['jungle', 'Copenhagen Wolves']
    cowTard: ['mid', 'Copenhagen Wolves']
    Forg1ven: ['adc', 'Copenhagen Wolves']
    Unlimited: ['support', 'Copenhagen Wolves']
    Mimer: ['top', 'Supa Hot Crew XD']
    Impaler: ['jungle', 'Supa Hot Crew XD']
    Moopz: ['mid', 'Supa Hot Crew XD']
    'Mr RalleZ': ['adc', 'Supa Hot Crew XD']
    Migxa: ['support', 'Supa Hot Crew XD']
    }


exports.players = players


# callback = (err) ->
#     if err
#         console.log(err)

# for key, data of players
#     #models.Player.findOne({'playername':key}, updatePlayers)

#     models.Player.update({'playername':key}, {'role':data[0], 'teamname':data[1]}, callback)

