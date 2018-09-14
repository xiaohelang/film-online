<template>
    <div class="cinema" v-show="selector">
        <div class="search">
            <img class="search-img" src="../../../static/image/search.png" alt="">
            <input type="search" :placeholder="searchPlaceholder" v-on:input="cinemaNameChange($event)" v-model="cinemaValue">
            <span @click="closeCinemaSelector()">取消</span>
        </div>
        <div class="address">
            <div class="dress">
                <span>当前定位城市：</span>
                <span class="lcation">{{locationCity}}</span>
            </div>
            <div class="addressImg"> <img src="../../../static/image/adderss.png" alt="" @click="getPositionFromBMap()"> </div>
        </div>
        <div v-if="findCinemaFlag == false" class="Info">
            <div class="leftInfo">
                <ul>
                    <li v-for="(item, index) in cinemaList" :key="index" @click="btnAddress(item)">
                        <span :class="{'isChecked' : item.isChecked}"> {{ item.cityName }} </span>
                    </li>
                </ul>
            </div>
            <div class="rightInfo" v-if="showAddress">
                <ul>
                    <li v-for="(data,index) in cityCinemas" :key="index" @click="closeCinemaSelector(data)">
                        <p>
                            <span class="infoShop"> {{ data.cinemaName }} </span>
                            <span v-show='data.distance ' class="distance"> {{ data.distance }}km </span>
                        </p>
                        <p class="position"> {{ data.cinemaAddress}} </p>
                    </li>
                </ul>
            </div>
        </div>
        <ul v-if="findCinemaFlag == true" class="searchBox">
            <li class="searchCell" v-for="(data,index) in searchCinemaList" :key="index" @click="closeCinemaSelector(data)">
                <div class="cell-left">{{data.cityName}}</div>
                <div class="cell-right">
                    <p>{{data.cinemaName}}</p>
                    <p>{{ data.cinemaAddress}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import BMap from 'BMap'
export default {
    // props: ['selector'],
    props: {
        selector: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        addCard: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        currentCinema: {
            type: Object,
            default: () => {
                return {}
            }
        },
        cinemaList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            showAddress: true,
            searchPlaceholder: '搜索',
            locationCity: '',
            selectCity: '',
            cityCinemas: [],
            findCinemaFlag: false,
            findCinema: [],
            cinemaValue: '',
            searchCinemaList: []
        }
    },
    created() {
        this.selectCity = this.currentCinema.cityName
        this.findCinemaByCityName()
        console.log(' this.selectCity-->', this.selectCity)
    },
    methods: {
        // 搜索影院
        cinemaNameChange() {
            this.searchCinemaList = []
            if (this.cinemaValue.length > 0) {
                this.findCinemaFlag = true
                let searchCinemaList = []
                let cinemas = this.cinemaList
                for (let i in cinemas) {
                    let cinemaList = cinemas[i].cinemaList
                    for (let j in cinemaList) {
                        if (
                            cinemaList[j].cinemaName.indexOf(this.cinemaValue) >
                            -1
                        ) {
                            let cinema = cinemaList[j]
                            cinema.cityName = cinemas[i].cityName
                            searchCinemaList.push(cinema)
                        }
                    }
                }
                this.searchCinemaList = searchCinemaList
                console.log('searchCinemaList-->', searchCinemaList)
            } else {
                this.findCinemaFlag = false
            }
        },
        btnAddress(data) {
            console.log('btnAddress')
            this.cinemaList.forEach(item => {
                item.isChecked = false
            })
            data.isChecked = true
            this.selectCity = data.cityName
            this.findCinemaByCityName()
        },
        closeCinemaSelector(selectedCinema) {
            console.log('关闭页面')
            this.cinemaValue = ''
            this.findCinemaFlag = false
            if (selectedCinema && this.addCard === false) {
                this.$omsCacheInfo.setCinemaInfo(selectedCinema)
            }
            this.$emit('upCloseCinemaSelector', selectedCinema)
        },
        findCinemaByCityName() {
            this.cityCinemas = []
            for (let i in this.cinemaList) {
                if (this.cinemaList[i].cityName === this.selectCity) {
                    if (this.cinemaList[i].cinemaList) {
                        this.cityCinemas = this.cinemaList[i].cinemaList
                        this.cinemaList[i].isChecked = true
                        break
                    }
                }
            }
        },
        // 获取百度地图位置
        getPositionFromBMap() {
            let self = this
            let geolocation = new BMap.Geolocation()
            let gc = new BMap.Geocoder()
            geolocation.getCurrentPosition(
                r => {
                    if (r.point) {
                        gc.getLocation(r.point, function(rs) {
                            let addComp = rs.addressComponents
                            console.log('currCity-->', addComp.city)
                            self.currentCinema.cityName = addComp.city
                            self.locationCity = addComp.city
                            self.cinemaList.forEach(item => {
                                if (
                                    addComp.city.indexOf(item.cityName) === -1
                                ) {
                                    item.isChecked = false
                                } else {
                                    item.isChecked = true
                                    self.selectCity = item.cityName
                                    self.findCinemaByCityName()
                                }
                            })
                        })
                    } else {
                        self.currentCinema.cityName = '定位失败，请手动选择城市'
                    }
                },
                { enableHighAccuracy: true }
            )
        }
    }
}
</script>

<style lang="scss">
.cinema {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 900;
    background: #fff;
    overflow: auto;
    .search {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 88px;
        padding: 14px 16px;
        box-sizing: border-box;
        background: rgba(247, 247, 250, 0.5);
        .search-img{
            width: 30px;
            height: 30px;
        }
        input[type='search'] {
            box-sizing: border-box;
            border: 0;
            background-size: 30px 30px;
            width: 70%;
            height: 100%;
            border: 0;
            border-radius: 10px;
            padding-left: 15px;
            box-sizing: border-box;
            font-size: 28px;
            color: #7a797b;
            outline: none;
        }
        input[type='search']:focus {
            background: #f3f3f3;
        }
        span {
            width: 20%;
            color: #54AAFF;
        }
        // input {
        //     width: 100%;
        //     height: 100%;
        //     background: #fff;
        //     border: 0;
        //     border-radius: 10px;
        //     padding-left: 15px;
        //     box-sizing: border-box;
        //     font-size: 28px;
        //     color: #7a797b;
        //     outline: none;
        // }
    }
    .address {
        padding: 12px 30px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
        .dress {
            font-size: 32px;
            height: 48px;
            line-height: 48px;
            color: #000000;
            .lcation {
                width: 110px;
                font-size: 24px;
                display: inline-block;
                vertical-align: middle;
                border: 1px solid rgba(198, 198, 198, 1);
            }
        }
        .addressImg {
            width: 48px;
            img {
                height: 100%;
                width: 100%;
            }
        }
    }
    .Info {
        background: #fff;
        display: flex;
        .leftInfo {
            border-right: 1px solid #dfdfdf;
            width: 250px;
            ul {
                li {
                    // width: 160px;
                    // height: 84px;
                    padding: 26px 32px;
                    box-sizing: border-box;
                    span {
                        height: 84px;
                        width: 100%;
                        text-align: center;
                        border-radius: 8px;
                        border: 1px solid #d9d9d9;
                        background: #fff;
                        font-size: 34px;
                        color: #262628;
                        font-weight: bold;
                        display: inline-block;
                        line-height: 84px;
                    }
                    .isChecked {
                        background: linear-gradient(
                            -124.3deg,
                            rgba(111, 133, 255, 1),
                            rgba(84, 170, 255, 1)
                        );
                        border: 0 !important;
                        color: #fff;
                    }
                }
            }
        }
        .rightInfo {
            width: 540px;
            ul {
                li {
                    height: 134px;
                    padding: 28px 32px 28px 20px;
                    box-sizing: border-box;
                    border-bottom: 1px solid #dfdfdf;
                    p {
                        display: flex;
                        justify-content: space-between;
                        color: #7a797b;
                        .infoShop {
                            font-size: 28px;
                            color: #262628;
                            height: 40px;
                            line-height: 40px;
                        }
                        .distance {
                            font-size: 28px;
                            height: 40px;
                            line-height: 40px;
                        }
                    }
                    .position {
                        width: 442px;
                        font-size: 24px;
                        height: 34px;
                        line-height: 34px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
    .searchBox {
        border-top: 1px solid #ccc;
        .searchCell {
            width: 750px;
            height: 100px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ccc;
            justify-content: space-around;
            .cell-left {
                width: 100px;
                height: 60px;
                border: 1px solid #ccc;
                line-height: 60px;
                border-radius: 10px;
            }
            .cell-right {
                height: 80px;
                width: 620px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                p {
                    color: #000;
                    text-align: left;
                    padding-left: 10px;
                    box-sizing: border-box;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                p:nth-child(2) {
                    color: #ccc;
                }
            }
        }
    }
}
.slideDown-enter-active,
.slideDown-leave-active {
    transition: transform 0.2s ease-out;
}
.slideDown-enter,
.slideDown-leave-active {
    transform: translate3d(0, -100%, 0);
}

.search {
    flex: 1;
    width: 100%;
    padding-left: 1rem;
}
input[type='search'] {
    box-sizing: border-box;
    border: 0;
    // background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABGdBTUEAALGPC/xhBQAABUlJREFUaAXdWT1oHEcU1unHR8ih0lZEKsWVkSrLkFaVQIYkJ93JBBUp0hm7sdMJbOlAnR0ICDdJk4AL6++wi8PChXAXMG6CMSmSTpZlFy7EmWBLQvm+5c3ydrTam9nblXQeWM2bN/N+vntvZ2afuro+sVZoB0+9Xv9qd3f3W+i4WCgUBg8ODgZB82HbAm8LvC3Qz/v6+h6Wy+V/g5kc/3gDWltbO7u/v38Njpbh17Cnby8Ast7T07M4OTn51lPWabkzoKWlpRKcuQkgP0FzyUn70Yua0HUHuu5OT083j17mP+MEaHl5eRLG70H9OX8TiRJvAOxqtVpdS1zlMZkICCAKKysrt6DvNukYvR/B24BTj9C/RCpt7e3t8Z3p6u3tHURq8n26ANlv0I/hOYMn0iB7AMZ8pVKpCR2Z9x3EORnoQIp9BuIPPJUYpdvg1Uql0v2JiYmdmPlDrEaj0d9sNmcwwR9owF4AMMsA/gNS8D97zmccC4jRQJotQVEEDIx+AG+hv7//5/Hx8fc+hsza9fX1z3d2dm5gPAs7RcNnT1CI1JV2IhULCGBuw9icNgZ6GylVnpqa+tPipxqurq5+jZSsQzgSLYCZwzs1n0ophA4B4gYA/gqjZJTCyF/d3d2XAWbT8LLoAepLgGpA14jRJ9GppN0oQqepkFszun/w6N2MkbmUNRjaYxNQz0DqSL3B+HyaLb2bSk3Dr3MTdAgG4w+SZplGxthjzx+KNmhL8c+JL4rlRoaAeANAmvHQ1G0hq3dGK7VpsbGg+fSFPmmeCx0CQi5fh4C+AWxzN3NRksUascXjwLQSfLpmBq59CAi/yHeWUC3t1mzpcRqKrZpeDJ94X/RqASDemiE1rCQ/8tBU42MhxSZvH6YNi29m3LIPAMkngF684XoD0ELt0mJzQ+uJ8U1PH6JNyl3UM9hheDc7kRZjO+JbK6cCQFBiPsrM+peGOIE+YjvGt0SXAkB4+SKAcC4EN+ZEyZwmbdu2b63MmpSLADKfAK2E85iPsR3xrZVNk3L8JglbsViMXInCiWMgYmx7+WJS7rX2FQfaF3p8nHSMba/ag4lQ5J2BUq8wZwk4xjYvqs7NRCgCCNIXnDVkv9C2/crHRAAIAs+1EHYW1gBOpNm2sW0/9XEkAMQioCU0xhqAxct9KDbHtCEAeqLHregAkFQ0X6jFZ6SgoVj5k2IzrAwBzCZqDH/7WDYpxwIFv+91u8WChmbkSYstVoTChvT7NRw4EiEgnNCLkGkquQGpzihWfqTY0p/hrCrRJ68WAmKtGVG6Y0nPsjpj8TIfio1ZS/FvqCm8s3gthyEgrkSI76IL932MizgX6ixktNSUcoEUSeq0pVTwGKmpsTMZAcQqC6J0FY++Cg0AVCMPUAKGZSydanT+xzTRoWAEEBlSD5snrdoIQD2DA5mlH3VRJ2yENTmx9whgHivbXmTsxQ/hZ5H+Afqq1obI5VoKFlv76GcA6oG27UrHAqIwi/UA8LsNShRnXqy3HE4N6khANCCRyvXfKQKEn/yX8fTImF0qUImAjPIc/+HF3YwbwGNkxBXQrDS1BerQpmBA6F42ivNIwTnw9eGrl/nQPDR/wTNiNgB5Z2bAY2RMI7j7AtbwEnunCGkN7fzTGD/IJtKY15lFAIg9NNuNlDcgDS7h3/rUyy9NHtKvAOQpnieuF812QLUFSIPLmk4L6tQC4g+UBtSpBpQG1KkH5AuqIwD5gOoYQK6gOgqQCyinmwIVnZaWcKMIvgw6DhB/WBsUDu2HQ0ND33Ou41KOTpsm51SVYEZHR3cN/5Pq/wfEdlFyq1lD2AAAAABJRU5ErkJggg==);
    background-size: 1.73rem;
    border-radius: 0.3rem;
    width: 100%;
    height: 3.2rem;
    font-size: 1.4rem;
}
input[type='search']:focus {
    background: #f3f3f3;
}
</style>
