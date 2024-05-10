const app = Vue.createApp({
    data(){
        return {
            searchText: '',
            selectedBuffet: null,
            selectBuffetEvents: [],
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
        },

        async getEvents(buffetId){
            let response = await fetch(`http://localhost:3000/api/v1/buffets/${buffetId}/events`)
            let data = await response.json()
            let events = []

            data.forEach(eventInfo => {
                let event = {}
                event.eventId = eventInfo.id
                event.buffetId = eventInfo.buffet_id
                event.name = eventInfo.name
                event.description = eventInfo.description
                event.standard_duration = this.convertMinutesToHours(eventInfo.standard_duration)
                event.max_guests = eventInfo.max_guests
                event.min_guests = eventInfo.min_guests
                event.menu = eventInfo.menu
                event.offers_alcohol = this.convertBooleanToHuman(eventInfo.offers_alcohol)
                event.offers_decoration = this.convertBooleanToHuman(eventInfo.offers_decoration)
                event.offers_valet_parking = this.convertBooleanToHuman(eventInfo.offers_valet_parking)
                event.offsite_event = this.convertBooleanToHuman(eventInfo.offsite_event)
                event.prices = []

                eventInfo.event_prices.forEach(eventPrice => {
                    let price = {}
                    price.id = eventPrice.id
                    price.eventID = eventPrice.event_id
                    price.dayType = this.dayTypeConverter(eventPrice.day_type)
                    price.extra_guest_price = eventPrice.extra_guest_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    price.extra_hour_price = eventPrice.extra_hour_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    price.standard_price = eventPrice.standard_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    event.prices.push(price)
                })

                console.log(event.prices)
                events.push(event)
            })
            return events
        },

        dayTypeConverter(dayType){
            return dayType == 'weekend' ? "fim de semana" : "dias úteis"
        },

        convertMinutesToHours(minutes) {
            var hours = Math.floor(minutes / 60);
            var minutesLeft = minutes % 60;
            return minutesLeft == 0 ? `${hours}h` :  `${hours}h${minutesLeft}`
        },

        convertBooleanToHuman(boolean) {
            return boolean === true ? 'Sim' : 'Não'
        },

        async selectBuffet(index) {
            this.selectedBuffet = this.buffetList[index]
            this.selectBuffetEvents = await this.getEvents(this.selectedBuffet.id)
        },
    }
})

app.mount("#app")