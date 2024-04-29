import {encoded, translations} from './data.js'

const translation = () => {

    let uniqueId = []
    let decoded = {}

    const decode = encoded.map((item, id) => {
        for (const key in item) {
            if (key.endsWith('Id'))  {
                switch (item[key]) {
                    case 'groupId': {
                        decoded[key] = item[key]
                        break
                    }
                    case 'service': {
                        decoded[key] = item[key]
                        break
                    }
                    case 'formatSize': {
                        decoded[key] = item[key]
                        break
                    }
                    case 'ca': {
                        decoded[key] = item[key]
                        break
                    }
                    default: {
                        decoded[key] = translations[item[key]] || item[key]
                    }
                }
            } else {
                decoded[key] = item[key]
            }
        }
        uniqueId.push(item.groupId)
        console.log(decoded)
    })
    console.log(uniqueId)
}

translation()

console.log("Let's rock")
console.log("ROCK AND STONE!")
// console.log(encoded, translations)
