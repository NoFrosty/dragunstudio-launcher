<template>
    <div class="window-controller">
        <div class="draggable">
            <span class="title-colored">Evo</span>
            <span class="title-white">Launcher</span>
        </div>
        <div class="window-controller-btn">
            <a id="open-dev-tool-btn"><b-icon pack="fas" icon="code" size="is-small" type="is-primary"></b-icon></a>
            <a><b-icon pack="fas" icon="cogs" size="is-small" type="is-primary"></b-icon></a>
            <a id="min-btn"><b-icon pack="fas" icon="window-minimize" size="is-small" type="is-primary"></b-icon></a>
            <a id="close-btn"><b-icon pack="fas" icon="times" size="is-small" type="is-primary"></b-icon></a>
        </div>
    </div>
</template>

<script>
export default {
    
    mounted:function(){
        const {BrowserWindow} = require('electron').remote
        // Minimize task
        document.getElementById("min-btn").addEventListener("click", (e) => {
            var window = BrowserWindow.getFocusedWindow();
            window.minimize();
        });
        document.getElementById("close-btn").addEventListener("click", (e) => {
            var window = BrowserWindow.getFocusedWindow();
            window.close();
        });
        document.getElementById("open-dev-tool-btn").addEventListener("click", (e) => {
            var window = BrowserWindow.getFocusedWindow();
            window.openDevTools();
        });
    },
}
</script>