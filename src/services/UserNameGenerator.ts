const nouns = require('@/assets/data/nouns.json');
const adjectives = require('@/assets/data/adjectives.json');

class UserNameGenerator{

    public static generateUsername(separator: string): string {
        const length = this.randomIntFromInterval(6,9);

        if(separator==undefined)
            separator="";

        const noun = nouns[Math.floor(Math.random()*nouns.length)];
        const adjective = adjectives[Math.floor(Math.random()*adjectives.length)];

        let result = noun + separator + adjective;
        
        if (length) {
            result = result.substring(0, length);
        }
        
        return this.capitalize(result)
    }

    private static randomIntFromInterval(min : number, max : number) : number{
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private static capitalize(userName : string) : string {
        if (typeof userName !== 'string') return ''
        return userName.charAt(0).toUpperCase() + userName.slice(1)
    }
}

export default UserNameGenerator