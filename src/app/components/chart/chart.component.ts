import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { StorageService } from 'src/app/services/storage.service';
import { IUser } from 'src/app/models/user.model';
import * as _cloneDeep from 'lodash/cloneDeep';
import * as _flatten from 'lodash/flatten';
import { IGraph } from './chart.model';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  allUsers: IUser[];
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  colorArr = [
    { key: 0, value: '#ef9a9a', range: '0 - 9' },
    { key: 1, value: '#f48fb1', range: '10 - 19' },
    { key: 2, value: '#ce93d8', range: '20 - 29' },
    { key: 3, value: '#b39ddb', range: '30 - 39' },
    { key: 4, value: '#9fa8da', range: '40 - 49' },
    { key: 5, value: '#90caf9', range: '50 - 59' },
    { key: 6, value: '#81d4fa', range: '60 - 69' },
    { key: 7, value: '#80deea', range: '70 - 79' },
    { key: 8, value: '#80cbc4', range: '80 - 89' },
    { key: 9, value: '#a5d6a7', range: '90 - 99' },
    { key: 10, value: '#c5e1a5', range: '100 - 109' },
    { key: 11, value: '#e6ee9c', range: '110 - 119' }
  ];
  constructor(private _storage: StorageService) { }

  ngOnInit() {
    this._storage.users.subscribe(users => {
      this.allUsers = users;
      this.createChart();
    });
    if (!this.allUsers && this.allUsers.length) {
      return;
    }
    this.createChart();
  }

  createChart() {
    d3.select('svg').remove();
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

    const legend = svg
      .append('g');

    legend
      .append('rect')
      .style('fill', '#00BCD4')
      .attr('color', '#fafafa')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 200)
      .attr('height', 270)

    const innerLegend = legend.selectAll('rect')
      .data(this.colorArr)
      .enter()

    innerLegend
      .append('rect')
      .attr("x", 10)
      .attr("y", function (d, i) { return i * 20 + 20; })
      .attr("width", 16)
      .attr("height", 16)
      .style("fill", (d) => d.value)

    innerLegend
      .append('text')
      .attr('x', 5)
      .attr('y', 25)
      .attr('font-size', '24px')
      .text('Age Range - Color')
      .attr('fill', '#fafafa');

    innerLegend
      .append('text')
      .text((d) => d.range)
      .attr("x", 40)
      .attr("y", function (d, i) { return i * 20 + 35; })
      .attr('fill', '#fafafa')
      .attr('font-size', '16px');


    const force = d3
      .forceSimulation()
      .force('link', d3.forceLink().distance(250))
      .force('charge', d3.forceManyBody().strength(100))
      .force('center', d3.forceCenter(contentWidth / 2, contentHeight / 2));

    const graph: IGraph = <IGraph>{ nodes: data, links };

    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke-width', 3)
      .attr('stroke', '#000');

    const svgNode = svg
      .append('g')
      .attr('class', 'nodes');

    const node = svgNode
      .selectAll('.node')
      .data(graph.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );


    const circle = node
      .append('circle')
      .attr('r', d => {
        return d.weight / 4;
      })
      .attr('fill', d => {
        return this.colorArr.filter(color => color.key === Math.floor(d.age / 10))[0].value;
      });

    const text = node
      .append('text')
      .text(d => d.name)
      .style('text-anchor', 'middle')
      .attr('y', 5)
      .attr('font-size', 14);

    force.nodes(graph.nodes).on('tick', ticked);

    force.force<d3.ForceLink<any, any>>('link').links(graph.links);

    function ticked() {
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

      node.attr("transform", function (d) { return 'translate(' + [d.x, d.y] + ')'; })
    }

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

  private _getLinks(data) {
    return _flatten(
      data.map(item => {
        return item.targets.map(t => {
          return { source: item.source, target: t, name: item.name };
        });
      })
    );
  }
}
