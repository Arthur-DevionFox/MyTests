import {encoded, translations} from './data.js'

const translation = () => {

    const decode = encoded.map((item, id) => {
        let decoded = {}


        for (const key in item) {
            if (key.endsWith('Id'))  {
                switch (item[key]) {
                    case 'groupId': {
                        decoded[key] = item[key]
                    }
                    case 'service': {
                        decoded[key] = item[key]
                    }
                    case 'formatSize': {
                        decoded[key] = item[key]
                    }
                    case 'ca': {
                        decoded[key] = item[key]
                    }
                    default: {
                        decoded[key] = translations[item[key]] || item[key]
                    }
                }
                console.log(decoded)
            } else {
                decoded[key] = item[key]
                console.log(decoded)
            }
        }
    })
}

translation()

console.log("Let's rock")
console.log("ROCK AND STONE!")
//console.log(encoded, translations)



// console.log(decoded)
