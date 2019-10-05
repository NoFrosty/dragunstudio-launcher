<template>
    <div>
        <div class="overview-panel">
            <div class="overview-panel-left">
                <div class="scrollable">
                    <p class="title is-3">News</p>
                    <a>
                        <article class="content">
                            <p class="title is-4">News Sample : This is a test</p>
                            <p class="article">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer cursus justo augue, sed vehicula dolor pharetra id. Duis rhoncus libero a orci condimentum, pharetra consectetur dui pharetra.</p>
                            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                        </article>
                    </a>
                    <a>
                        <article class="content">
                            <p class="title is-4">News Sample : This is a test</p>
                            <p class="article">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer cursus justo augue, sed vehicula dolor pharetra id. Duis rhoncus libero a orci condimentum, pharetra consectetur dui pharetra.</p>
                            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                        </article>
                    </a>
                    <a>
                        <article class="content">
                            <p class="title is-4">News Sample : This is a test</p>
                            <p class="article">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer cursus justo augue, sed vehicula dolor pharetra id. Duis rhoncus libero a orci condimentum, pharetra consectetur dui pharetra.</p>
                            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                        </article>
                    </a>
                    <a>
                        <article class="content">
                            <p class="title is-4">News Sample : This is a test</p>
                            <p class="article">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer cursus justo augue, sed vehicula dolor pharetra id. Duis rhoncus libero a orci condimentum, pharetra consectetur dui pharetra.</p>
                            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                        </article>
                    </a>
                </div>
            </div>
            <div class="overview-panel-right">
                <div class="scrollable">
                    <p class="article">Last played : 3 days ago</p>
                    <p class="article">Time played : 115 hours</p>
                    <p class="article">Lasts Achievments : </p>
                </div>
            </div>
        </div>

        <div class="overview-download">
            <div class="overview-download-top">
                <div class="overview-download-top-right">
                    <div>
                        <a>
                            <b-icon pack="fas" icon="pause" size="is-small" type="is-primary"></b-icon>
                        </a>
                        <a>
                            <b-icon pack="fas" icon="play" size="is-small" type="is-primary"></b-icon>
                        </a>
                        <a>
                            <b-icon pack="fas" icon="cog" size="is-small" type="is-primary"></b-icon>
                        </a>
                    </div>
                </div>
            </div>

            <div class="overview-download-bottom">
                <div class="overview-download-bottom-left">
                    <b-button size="is-large">Play</b-button>
                </div>
                <div class="overview-download-bottom-right">
                    <progress class="progress is-primary" value="15" max="100">15%</progress>
                    <nav class="level">
                        <!-- Left side -->
                        <div class="level-left">
                            <DropDownGameMode class="level-item" v-model="gameMode"/>
                            <b-dropdown aria-role="list" class="is-up">
                                <button class="button is-primary is-auto" slot="trigger">
                                    <span>Options</span>
                                    <b-icon pack="fas" icon="caret-down" ></b-icon>
                                </button>
                                <b-dropdown-item aria-role="listitem">Settings</b-dropdown-item>
                                <b-dropdown-item aria-role="listitem">Uninstall</b-dropdown-item>
                            </b-dropdown>
                        </div>

                        <!-- Right side -->
                        <div class="level-right">
                            <p class="level-item">1.26 GB OUT OF 2.17 GB</p>
                        </div>
                    </nav>
                </div>


            </div>
        </div>
    </div>
</template>
<script>
    import { GAME_MODE } from '@/services/constants.js'
    import DropDownGameMode from './DropDownGameMode.vue';
    
    export default {
        data() {
            return {
                gameMode: GAME_MODE.PUBLIC
            }
        },
        components: {
            DropDownGameMode
        }
    }
</script>