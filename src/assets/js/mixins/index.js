import axios from "axios";

import {
    mapActions,
    mapState
} from "vuex";

let instance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 30000,
    withCredentials: true
});

const ALBUM = 1,
    PLAYLIST = 2,
    ARTIST = 3;


export {
    instance,
    ALBUM,
    PLAYLIST,
    ARTIST
}
export default {
    filters: {
        subName: function (value) {
            if (!value) return "";
            let value2 = value.split(" ")[1];
            if (!value2) return value.charAt(0).toUpperCase();

            return value.charAt(0).toUpperCase() + value2.charAt(0).toUpperCase();
        }
    },
    methods: {
        ...mapActions(["setViewFullActions"]),
        ...mapActions(["setTrackListActions"]),
        ...mapActions(["setSearchListActions"]),
        ...mapActions(["setSearchResultActions"]),
        ...mapActions(["setFocusFlagActions"]),
        ...mapActions(["setCategoryListActions"]),
        ...mapActions(["setResLengthActions"]),
        ...mapActions(["setCookieActions"]),
        ...mapActions(["setRouterHistoryLengthActions"]),
        ...mapActions(["setIsBackActions"]),



        viewAll(event, type, retryFlag) {
            if (event.target.disabled) { // 点击太频繁了
                console.log('点击太频繁了');
                return
            }
            if (type === 1) {
                this.setFocusFlagActions(false);

                this.$router
                    .push({
                        path: "/search/albums",
                        query: {
                            q: this.result
                        }
                    })
                    .catch(err => {});
                if (retryFlag) {
                    this.searchAlbums(retryFlag)
                } else {
                    this.setCategoryListActions({
                        type: "album",
                        playLists: this.albums2
                    });
                }

            } else if (type === 2) {

                this.setFocusFlagActions(false);
                if (retryFlag) {
                    this.searchPlayLists(retryFlag);
                } else {
                    this.setCategoryListActions({
                        type: "play-list",
                        playLists: this.playLists2
                    });
                }
                this.$router
                    .push({
                        path: "/search/play-list",
                        query: {
                            q: this.result
                        }
                    })
                    .catch(err => {});

            }
        },
        serialData(data, tag) {
            let arr = [];
            data.forEach(function (item) {
                tag ? (item = item.album) : (item = item);
                let {
                    blurPicUrl,
                    name,
                    type,
                    artists,
                    id
                } = item;

                arr.push({
                    src: blurPicUrl,
                    title: name,
                    artists,
                    type,
                    id
                });
            });
            return arr;
        },
        serialData2(data) {
            let arr = [];
            data.forEach(function (item) {
                let {
                    dt,
                    name,
                    id,
                    ar,
                    al
                } = item;
                arr.push({
                    time: dt,
                    name,
                    artists: ar,
                    id,
                    album: al
                });

            });
            return arr;
        },
        goToAlbum(event, id, focusFlag) {
            // if (event.target.disabled) { // 点击太频繁了
            //     console.log('点击太频繁了');
            //     return
            // }
            if (focusFlag) {
                this.setFocusFlagActions(false);
            }
            this.setIsBackActions(false);

            this.$router.push({
                path: "/album",
                query: {
                    id
                }
            });
        },
        goToArtist(event, id, focusFlag) {
            if (event.target.disabled) { // 点击太频繁了
                console.log('点击太频繁了');
                return
            }
            // if (!event.target.disabled) {
            //     event.target.disabled = true
            //     setTimeout(() => {
            //         event.target.disabled = false
            //     }, 10000)
            // }



            if (focusFlag) {
                this.setFocusFlagActions(false);
            }
            this.setIsBackActions(false);

            this.$router.push({
                path: "/artist",
                query: {
                    id
                }
            }).then(res => {
                console.log(1111111);

            }).
            catch(err => {
                console.log(err);
            });
        },
        goToPlayList(event, id, focusFlag) {
            if (event.target.disabled) { // 点击太频繁了
                console.log('点击太频繁了');
                return
            }
            if (focusFlag) {
                this.setFocusFlagActions(false);
            }
            this.setIsBackActions(false);

            this.$router.push({
                path: "/play-list",
                query: {
                    id
                }
            }).catch(err => {
                console.log(err);
            });
        },
        goToTracks(event) {
            if (event.target.disabled) { // 点击太频繁了
                console.log('点击太频繁了');
                return
            }
            this.searchSongs()
            this.setViewFullActions(false);
            this.setFocusFlagActions(false);

            this.$router
                .push({
                    path: "/search/tracks",
                    query: {
                        q: this.result
                    }
                })
                .catch(err => {});
        },
        goToTracks2(event) {
            if (event.target.disabled) { // 点击太频繁了
                console.log('点击太频繁了');
                return
            }
            let id = this.$route.query.id;
            this.setViewFullActions(true);

            this.$router
                .push({
                    path: "/top-tracks",
                    query: {
                        id
                    }
                })
                .catch(err => {});
        },
        relatedArtist(id) {

            instance
                .get("/simi/artist", {
                    params: {
                        id
                    }
                })
                .then(res => {
                    let artists = [];
                    res.data.artists.forEach(function (item) {
                        let {
                            id,
                            img1v1Url,
                            name: title,
                            name,
                        } = item;
                        artists.push({
                            id,
                            name,
                            title,
                            src: img1v1Url
                        });
                    });
                    this.artistsList = {
                        title: "Related Artists",
                        data: artists
                    };
                });
        },
        searchAlbums() {
            if (this.result) {
                instance
                    .get("/search", {
                        params: {
                            keywords: this.result,
                            type: 10,
                            limit: 100
                        }
                    })
                    .then(res => {
                        //获取歌手单曲
                        let playLists = [],
                            playLists2 = [];
                        res.data.result.albums.forEach(function (item) {
                            let {
                                name: title,
                                id,
                                picUrl,
                                artists,
                                artist: {
                                    name,
                                    // id: subId
                                }
                            } = item;
                            playLists.push({
                                title,
                                id,
                                src: picUrl,
                                artists
                            });
                            playLists2.push({
                                title,
                                id,
                                src: picUrl,
                                desc: name,
                                // subId,
                                artists
                            });
                        });
                        this.albums2 = playLists2;
                        this.albums = {
                            title: "Albums",
                            data: playLists
                        };
                        return res;
                    }).then(res => {
                        this.setCategoryListActions({
                            type: "album",
                            playLists: this.albums2
                        });

                    })
            }
        },
        searchPlayLists() {
            if (this.result) {
                instance
                    .get("/search", {
                        params: {
                            keywords: this.result,
                            type: 1000,
                            limit: 100
                        }
                    })
                    .then(res => {
                        //获取歌手单曲

                        let playLists = [],
                            playLists2 = [];
                        res.data.result.playlists.forEach(function (item) {
                            let {
                                name: title,
                                id,
                                coverImgUrl,
                                creator: {
                                    nickname
                                }
                            } = item;
                            playLists.push({
                                title,
                                id,
                                src: coverImgUrl
                                // artists:
                            });
                            playLists2.push({
                                title,
                                id,
                                src: coverImgUrl,
                                desc: nickname
                            });
                        });
                        this.playLists2 = playLists2;
                        this.playLists = {
                            title: "PlayLists",
                            data: playLists
                        };
                        return res;
                    }).then(res => {
                        this.setCategoryListActions({
                            type: "play-list",
                            playLists: this.playLists2
                        });
                    })
            }
        },
        searchArtists() {
            if (this.result) {
                instance
                    .get("/search", {
                        params: {
                            keywords: this.result,
                            type: 100,
                            limit: 100
                        }
                    })
                    .then(res => {
                        //获取歌手单曲

                        let playLists = [];
                        res.data.result.artists.forEach(function (item) {
                            let {
                                name,
                                name: title,
                                id,
                                picUrl
                            } = item;
                            playLists.push({
                                name,
                                title,
                                id,
                                src: picUrl
                            });
                        });
                        this.artistsList = {
                            title: "Artists",
                            data: playLists
                        };
                    });
            }
        },
        searchSongs() {
            if (this.result) {
                instance
                    .get("/search", {
                        params: {
                            keywords: this.result,
                            type: 1,
                            limit: 100
                        }
                    })
                    .then(res => {
                        //获取歌手单曲

                        let tracks = [];
                        res.data.result.songs.forEach(item => {
                            let {
                                duration,
                                name,
                                id,
                                artists,
                                album
                            } = item;
                            tracks.push({
                                time: duration,
                                name,
                                artists,
                                album,
                                id
                            });
                        });
                        this.setTrackListActions(tracks);
                    });
            }
        }
    },
    computed: {
        ...mapState({
            // 箭头函数可使代码更简练
            searchList: "searchList",
            searchResult: "searchResult",
            focusFlag: "focusFlag",
            resLength: "resLength",
            userCookie: "userCookie",
            trackList: "trackList",
            viewFull: "viewFull",
            categoryList: "categoryList",
            routerHistoryLength: "routerHistoryLength"
        })
    },
}
