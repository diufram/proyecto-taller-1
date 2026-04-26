import {
    Component,
    Input,
    AfterViewInit,
    OnDestroy,
    Inject,
    PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import * as L from 'leaflet';
import { MapPoint } from '../models/dashboard.model';

@Component({
    selector: 'app-map-widget',
    standalone: true,
    imports: [CommonModule, ButtonModule, TooltipModule],
    template: `
        <div class="map-widget-container">
            <div class="map-wrapper">
                <div [id]="mapId" class="map-container"></div>

                <div class="map-controls-overlay">
                    <button
                        pButton
                        icon="pi pi-compass"
                        class="glass-btn p-button-rounded"
                        (click)="locateUser()"
                        pTooltip="Mi ubicación"
                        tooltipPosition="left"
                    ></button>

                    <button
                        pButton
                        icon="pi pi-expand"
                        class="glass-btn p-button-rounded mt-2"
                        (click)="fitBounds()"
                        *ngIf="points.length > 0"
                        pTooltip="Ver todo"
                        tooltipPosition="left"
                    ></button>
                </div>

                <div class="map-info-pill" [class.visible]="points.length > 0">
                    <div class="flex align-items-center gap-3">
                        <div class="flex align-items-center gap-2">
                            <span class="indicator-dot cell-dot"></span>
                            <span class="font-medium text-sm"
                                >{{ cellCount }} Células</span
                            >
                        </div>

                        <div class="separator"></div>

                        <div class="flex align-items-center gap-2">
                            <span class="indicator-dot person-dot"></span>
                            <span class="font-medium text-sm"
                                >{{ personCount }} Personas</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            /* --- ESTRUCTURA --- */
            .map-widget-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 500px;
            }

            .map-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid var(--surface-border, #dfe7ef);
                background: var(--surface-ground, #f8f9fa);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            }

            .map-container {
                width: 100%;
                height: 100%;
                z-index: 1;
            }

            /* --- MODO OSCURO (CORREGIDO) --- */
            :host-context(.dark-mode) ::ng-deep .leaflet-tile-pane,
            :host-context(.layout-dark) ::ng-deep .leaflet-tile-pane,
            :host-context(.app-dark) ::ng-deep .leaflet-tile-pane,
            :host-context(.p-dark) ::ng-deep .leaflet-tile-pane,
            :host-context([data-theme='dark']) ::ng-deep .leaflet-tile-pane {
                filter: invert(100%) hue-rotate(180deg) brightness(95%)
                    contrast(90%);
            }

            /* --- CONTROLES FLOTANTES --- */
            .map-controls-overlay {
                position: absolute;
                top: 1rem;
                right: 1rem;
                z-index: 400;
                display: flex;
                flex-direction: column;
            }

            ::ng-deep .glass-btn {
                background: var(--surface-card, #fff) !important;
                color: var(--text-color, #333) !important;
                border: 1px solid var(--surface-border, #dfe7ef) !important;
                opacity: 0.95;
                backdrop-filter: blur(8px);
                width: 40px !important;
                height: 40px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s;
            }
            ::ng-deep .glass-btn:hover {
                background: var(--surface-overlay, #fff) !important;
                color: var(--primary-color, #3b82f6) !important;
                transform: translateY(-2px);
            }

            /* --- INFO PILL --- */
            .map-info-pill {
                position: absolute;
                bottom: 1.5rem;
                left: 50%;
                transform: translateX(-50%) translateY(150%);
                z-index: 400;
                background: var(--surface-card, #fff);
                border: 1px solid var(--surface-border, #dfe7ef);
                color: var(--text-color, #333);
                opacity: 0.95;
                backdrop-filter: blur(10px);
                padding: 0.6rem 1.2rem;
                border-radius: 50px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                transition: transform 0.4s
                    cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .map-info-pill.visible {
                transform: translateX(-50%) translateY(0);
            }

            .separator {
                width: 1px;
                height: 15px;
                background: var(--surface-border);
                margin: 0 8px;
            }

            .indicator-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                display: inline-block;
            }
            .cell-dot {
                background-color: #3b82f6;
                box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
            }
            .person-dot {
                background-color: #10b981;
            }

            /* --- MARCADORES --- */
            ::ng-deep .custom-div-icon {
                background: transparent;
                border: none;
            }

            ::ng-deep .marker-pin-cell {
                width: 40px;
                height: 40px;
                background: #3b82f6;
                border: 3px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }
            ::ng-deep .marker-pin-cell::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #3b82f6;
                opacity: 0.6;
                animation: pulse-ring 2s infinite;
                z-index: -1;
            }

            ::ng-deep .marker-pin-person {
                width: 28px;
                height: 28px;
                background: #10b981;
                border: 2px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 2px 5px rgba(16, 185, 129, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @keyframes pulse-ring {
                0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.7;
                }
                100% {
                    transform: translate(-50%, -50%) scale(2.5);
                    opacity: 0;
                }
            }

            ::ng-deep .leaflet-control-attribution {
                display: none;
            }
        `,
    ],
})
export class MapWidget implements AfterViewInit, OnDestroy {
    private _points: MapPoint[] = [];

    @Input() set points(value: MapPoint[] | null | undefined) {
        this._points = value ?? [];
        this.updateCounts();
        if (this.map) this.updateMarkers();
    }

    get points(): MapPoint[] {
        return this._points;
    }

    public mapId = `dashboard-map-${Math.random().toString(36).substring(2, 9)}`;
    private map: L.Map | undefined;
    private markersLayer: L.LayerGroup | undefined;

    public cellCount = 0;
    public personCount = 0;

    private readonly defaultCenter: L.LatLngExpression = [-17.7833, -63.1821];

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const checkElement = () => {
            const mapElement = document.getElementById(this.mapId);
            if (mapElement) {
                requestAnimationFrame(() => this.initMap());
            } else {
                setTimeout(checkElement, 50);
            }
        };

        checkElement();
    }

    private updateCounts(): void {
        const pts = this.points; // ya nunca es null/undefined
        this.cellCount = pts.filter((p) => p?.type === 'CELULA').length;
        this.personCount = pts.filter((p) => p?.type === 'PERSONA').length;
    }

    private initMap(): void {
        if (this.map) return;

        try {
            this.map = L.map(this.mapId, {
                center: this.defaultCenter,
                zoom: 13,
                zoomControl: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(this.map);

            L.control.zoom({ position: 'bottomright' }).addTo(this.map);

            this.markersLayer = L.layerGroup().addTo(this.map);

            if (this.points.length > 0) this.updateMarkers();

            setTimeout(() => this.map?.invalidateSize(), 200);
        } catch (error) {
            console.error('Error iniciando mapa:', error);
        }
    }

    private updateMarkers(): void {
        if (!this.map || !this.markersLayer) return;

        this.markersLayer.clearLayers();

        const validPoints = this.points.filter(
            (p) => typeof p?.lat === 'number' && typeof p?.lng === 'number',
        );

        validPoints.forEach((point) => {
            const isCelula = point.type === 'CELULA';

            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `
          <div class="${isCelula ? 'marker-pin-cell' : 'marker-pin-person'}">
            <i class="pi ${
                isCelula ? 'pi-home text-xl' : 'pi-user text-xs'
            } text-white"></i>
          </div>
        `,
                iconSize: isCelula ? [40, 40] : [28, 28],
                iconAnchor: isCelula ? [20, 20] : [14, 14],
                popupAnchor: [0, -20],
            });

            const marker = L.marker([point.lat, point.lng], {
                icon: customIcon,
            });

            const popupContent = `
        <div style="text-align:center; min-width: 120px; font-family: var(--font-family);">
          <b style="color: ${isCelula ? '#3b82f6' : '#10b981'}; font-size: 14px; display:block; margin-bottom:4px;">
            ${point.name ?? ''}
          </b>
          <span style="color: var(--text-color-secondary); font-size: 11px;">
            ${point.extra || (isCelula ? 'Célula' : 'Miembro')}
          </span>
        </div>
      `;

            marker.bindPopup(popupContent);
            this.markersLayer!.addLayer(marker);
        });

        this.fitBounds();
    }

    public fitBounds(): void {
        if (!this.map || !this.markersLayer) return;

        const layers = this.markersLayer.getLayers();
        if (layers.length > 0) {
            const group = L.featureGroup(layers as L.Layer[]);
            this.map.fitBounds(group.getBounds(), {
                padding: [50, 50],
                maxZoom: 16,
            });
        } else {
            this.map.setView(this.defaultCenter, 13);
        }
    }

    public locateUser(): void {
        if (!this.map) return;
        this.map.locate({ setView: true, maxZoom: 15 });
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
            this.map = undefined;
        }
    }
}
