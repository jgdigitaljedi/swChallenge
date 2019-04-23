import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { StorageService } from 'src/app/services/storage.service';
import { IUser } from 'src/app/models/user.model';
import * as _cloneDeep from 'lodash/cloneDeep';
import * as _flatten from 'lodash/flatten';
import { IGraph, ILink, IColor, IChartData } from './chart.model';
import { Observable, BehaviorSubject } from 'rxjs';

/**
 * d3 svg chart force layout chart with legend
 *
 * @export
 * @class ChartComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {
  @ViewChild('chart') private chartContainer: ElementRef;
  allUsers: IUser[];
  margin = { top: 20, right: 20, bottom: 30, left: 40 }; // implicitly typed
  colorArr: IColor[] = [
    { key: 0, value: '#f44336', range: '0 - 9' },
    { key: 1, value: '#9c27b0', range: '10 - 19' },
    { key: 2, value: '#3f51b5', range: '20 - 29' },
    { key: 3, value: '#2196f3', range: '30 - 39' },
    { key: 4, value: '#00bcd4', range: '40 - 49' },
    { key: 5, value: '#009688', range: '50 - 59' },
    { key: 6, value: '#8bc34a', range: '60 - 69' },
    { key: 7, value: '#ffeb3b', range: '70 - 79' },
    { key: 8, value: '#ff9800', range: '80 - 89' },
    { key: 9, value: '#ff5722', range: '90 - 99' },
    { key: 10, value: '#795548', range: '100 - 109' },
    { key: 11, value: '#9e9e9e', range: '110 - 119' },
    { key: 12, value: '#607d8b', range: '120' }
  ];
  chartSubscription;
  constructor(private _storage: StorageService) { }

  /**
   * Subscribes to storage service data and creates chart
   *
   * @returns
   * @memberof ChartComponent
   */
  ngOnInit() {
    this.chartSubscription = this._storage.users.subscribe(users => {
      this.allUsers = users;
      this.createChart();
    });
    if (!this.allUsers && this.allUsers.length) {
      return;
    }
    this.createChart();
  }

  ngOnDestroy() {
    this.chartSubscription.unsubscribe();
  }

  /**
   * Method responsible for creating chart
   *
   * @memberof ChartComponent
   */
  createChart(): void {
    d3.select('svg').remove();
    /** I don't like this appraoch and, if I have time, I will add nodes and links instead of redrawing each time */
    const element = this.chartContainer.nativeElement;
    const data = _cloneDeep(this.allUsers).map(user => {
      // just making it more semantic of a data structure for the chart; not really necessary; for my sanity
      return {
        source: user.id,
        name: user.name,
        targets: user.friends ? user.friends.map(friend => friend.id) : [],
        weight: user.weight,
        age: user.age
      };
    });
    const links = this._getLinks(data);
    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', contentWidth)
      .attr('height', contentHeight);

    this._drawLegend(svg);

    // setup force
    const force = d3
      .forceSimulation()
      .force('link', d3.forceLink().distance(250))
      .force('charge', d3.forceManyBody().strength(10))
      .force('center', d3.forceCenter(contentWidth / 2, contentHeight / 2));

    const graph: IGraph = <IGraph>{ nodes: data, links };

    // add links
    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke-width', 3)
      .attr('stroke', '#000');

    // create group for nodes
    const svgNode = svg.append('g').attr('class', 'nodes');

    // add g for individual node
    const node = svgNode
      .selectAll('.node')
      .data(graph.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // add circle to node group
    const circle = node
      .append('circle')
      .attr('r', d => {
        return d.weight / 4;
      })
      .attr('fill', d => {
        return this.colorArr.filter(color => color.key === Math.floor(d.age / 10))[0].value;
      });

    // add text to node group
    const text = node
      .append('text')
      .text(d => d.name)
      .style('text-anchor', 'middle')
      .attr('y', 5)
      .attr('font-size', 14)
      .style('fill', '#fafafa');

    // tick event listener and actions
    force.nodes(graph.nodes).on('tick', () => {
      link
        .attr('x1', function (d: any) {
          return d.source.x;
        })
        .attr('y1', function (d: any) {
          return d.source.y;
        })
        .attr('x2', function (d: any) {
          return d.target.x;
        })
        .attr('y2', function (d: any) {
          return d.target.y;
        });

      node.attr('transform', function (d) {
        return 'translate(' + [d.x, d.y] + ')';
      });
    });

    force.force<d3.ForceLink<any, any>>('link').links(graph.links);

    /** These could have been broken into component methods but weren't for time's sake for this challenge.
     * It would be a lot of typing and hoisting method vars into component vars which is merely time consuming ATM.
     * Typically I would rarely have functions like this inside a component unless there was recursion or something weird.
     * */
    function dragstarted(d) {
      if (!d3.event.active) {
        force.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        force.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }

  /**
   * Draws legend for force chart
   *
   * @private
   * @param {d3.Selection<SVGElement, {}, HTMLElement, any>} svg
   * @memberof ChartComponent
   */
  private _drawLegend(svg: d3.Selection<SVGElement, {}, HTMLElement, any>): void {
    const cLen = this.colorArr.length;
    const legend = svg.append('g');

    legend
      .append('rect')
      .style('fill', '#00BCD4')
      .attr('color', '#fafafa')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 220)
      .attr('height', 190);

    const innerLegend = legend
      .selectAll('rect')
      .data(this.colorArr)
      .enter();

    innerLegend
      .append('rect')
      .attr('x', (d, i) => {
        if (i < cLen / 2) {
          return 10;
        } else {
          return 110;
        }
      })
      .attr('y', function (d, i) {
        if (i < cLen / 2) {
          return i * 20 + 32;
        } else {
          return (i + 1 - cLen / 2) * 20 + 22;
        }
      })
      .attr('width', 16)
      .attr('height', 16)
      .style('fill', d => d.value)
      .attr('stroke', '#fafafa')
      .attr('stroke-width', 1);

    innerLegend
      .append('text')
      .attr('x', 13)
      .attr('y', 35)
      .attr('font-size', '24px')
      .text('Age Range - Color')
      .attr('fill', '#fafafa');

    innerLegend
      .append('text')
      .text(d => d.range)
      .attr('x', (d, i) => {
        if (i < cLen / 2) {
          return 40;
        } else {
          return 140;
        }
      })
      .attr('y', (d, i) => {
        if (i < cLen / 2) {
          return i * 20 + 45;
        } else {
          return (i + 1 - cLen / 2) * 20 + 35;
        }
      })
      .attr('fill', '#fafafa')
      .attr('font-size', '16px');
  }

  /**
   * Creates links array with proper data structure
   *
   * @private
   * @param {IChartData[]} data
   * @returns {ILink[]}
   * @memberof ChartComponent
   */
  private _getLinks(data: IChartData[]): ILink[] {
    return _flatten(
      data.map(item => {
        return item.targets.map(t => {
          return { source: item.source, target: t, name: item.name };
        });
      })
    );
  }
}
