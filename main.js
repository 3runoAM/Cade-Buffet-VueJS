const app = Vue.createApp({
    data(){
        return {
            searchText: '',
            buffetList: []
        }
    },

    computed: {
        resultList() {
            if(this.searchText) {
                return this.buffetList.filter(buffet => {
                    return buffet.name.toLowerCase().includes(this.searchText.toLowerCase());
                })
            }else {
                return this.buffetList
            }
        }
    },

    async mounted(){
        this.resultList = await this.getBuffets()
    },

    methods: {
        async getBuffets() {
            let response = await fetch("http://localhost:3000/api/v1/buffets")
            let data = await response.json()
            console.log(data)
            data.forEach(buffetInfo => {
                let buffet = {}
                buffet.id = buffetInfo.id
                buffet.name = buffetInfo.brand_name
                buffet.companyName = buffetInfo.company_name
                buffet.crn = buffetInfo.crn
                buffet.description = buffetInfo.description
                buffet.email = buffetInfo.email
                buffet.phone = buffetInfo.phone

                this.buffetList.push(buffet)
            });
        }
    }
})

app.mount("#app")