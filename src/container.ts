import awilix, { createContainer, InjectionMode } from 'awilix'

declare global {
    interface Window { container: awilix.AwilixContainer; }
}

if (!window.container) {
    window.container = createContainer({
        injectionMode: InjectionMode.CLASSIC
    }) 
}

export default window.container;