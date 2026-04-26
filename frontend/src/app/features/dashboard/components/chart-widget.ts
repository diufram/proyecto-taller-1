import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartData } from '../models/dashboard.model';

@Component({
    standalone: true,
    selector: 'app-dashboard-chart',
    imports: [ChartModule],
    template: `
        <div class="card h-full">
            <div class="font-semibold text-xl mb-4">{{ title }}</div>
            <p-chart type="bar" [data]="processedData" [options]="chartOptions" class="h-80" />
        </div>
    `
})
export class DashboardChartWidget implements OnChanges {
    @Input() rawData: ChartData[] = [];
    @Input() title: string = 'Gráfico';
    @Input() color: string = '#6366f1'; // Color base (indigo-500)

    processedData: any;
    chartOptions: any;

    constructor() {
        this.initOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['rawData'] && this.rawData) {
            this.updateChart();
        }
    }

    updateChart() {
        // Transformar Backend [{label: '2023-01', value: 10}] -> ChartJS
        const labels = this.rawData.map(d => d.label); // Fechas
        const values = this.rawData.map(d => d.value); // Valores

        this.processedData = {
            labels: labels,
            datasets: [
                {
                    label: this.title,
                    data: values,
                    backgroundColor: this.color,
                    borderColor: this.color,
                    borderRadius: 6,
                    barThickness: 30
                }
            ]
        };
    }

    initOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { display: false }
                },
                y: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder, drawBorder: false }
                }
            }
        };
    }
}