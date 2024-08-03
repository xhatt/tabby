/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { debounce } from 'utils-decorators/dist/esm/debounce/debounce'
import { Component, HostBinding, Inject, NgZone, Optional } from '@angular/core'
import {
    DockingService,
    ConfigService,
    Theme,
    HostAppService,
    Platform,
    isWindowsBuild,
    BaseComponent,
    Screen,
    PlatformService,
    WIN_BUILD_WINDOW_MATERIAL_SUPPORTED,
} from 'tabby-core'


/** @hidden */
@Component({
    selector: 'window-settings-tab',
    templateUrl: './windowSettingsTab.component.pug',
})
export class WindowSettingsTabComponent extends BaseComponent {
    screens: Screen[]
    Platform = Platform
    isWindowMaterialSupported = false

    @HostBinding('class.content-box') true

    constructor (
        public config: ConfigService,
        public hostApp: HostAppService,
        public platform: PlatformService,
        public zone: NgZone,
        @Inject(Theme) public themes: Theme[],
        @Optional() public docking?: DockingService,
    ) {
        super()

        this.themes = config.enabledServices(this.themes)

        const dockingService = docking
        if (dockingService) {
            this.subscribeUntilDestroyed(dockingService.screensChanged$, () => {
                this.zone.run(() => this.screens = dockingService.getScreens())
            })
            this.screens = dockingService.getScreens()
        }

        this.isWindowMaterialSupported = isWindowsBuild(WIN_BUILD_WINDOW_MATERIAL_SUPPORTED)
    }

    @debounce(500)
    saveConfiguration (requireRestart?: boolean) {
        this.config.save()
        if (requireRestart) {
            this.config.requestRestart()
        }
    }
}
