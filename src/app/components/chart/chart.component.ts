import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { StorageService } from 'src/app/services/storage.service';
import { IUser } from 'src/app/models/user.model';
import * as _cloneDeep from 'lodash/cloneDeep';
import * as _flatten from 'lodash/flatten';
import { AttrAst } from '@angular/compiler';

interface Node {
  id: string;
  group: number;
}

interface Link {
  source: string;
  target: string;
  // value: number;
}

interface Graph {
  nodes: Node[];
  links: Link[];
}

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
    { key: 0, value: '#90caf9' },
    { key: 1, value: '#80deea' },
    { key: 2, value: '#a5d6a7' },
    { key: 3, value: '#e6ee9c' },
    { key: 4, value: '#ffe082' },
    { key: 5, value: '#ffab91' },
    { key: 6, value: '#bcaaa4' },
    { key: 7, value: '#eeeeee' },
    { key: 8, value: '#b0bec5' }
  ];
  constructor(private _storage: StorageService) {}

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
      // just making it more semantic of a data structure for the chart; not really necessary
      return {
        source: user.id,
        name: user.name,
        targets: user.friends ? user.friends.map(friend => friend.id) : [],
        weight: user.weight,
        age: user.age
      };
    });
    const links = this._getLinks(data);
    console.log('links', links);
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const force = d3
      .forceSimulation()
      .force('link', d3.forceLink().distance(200))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(contentWidth / 2, contentHeight / 2));

    const graph: Graph = <Graph>{ nodes: data, links };

    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke-width', 3)
      .attr('stroke', '#000');

    // const node = svg
    //   .append('g')
    //   .attr('class', 'nodes')
    //   .selectAll('circle')
    //   .data(graph.nodes)
    //   .enter()
    //   .append('circle')
    //   .attr('r', d => {
    //     return d['weight'] / 5;
    //   })
    //   .attr('fill', d => {
    //     return this.colorArr.filter(color => color.key === Math.floor(d['age'] / 10))[0].value;
    //   });

    const node = svg
      .selectAll('.node')
      .data(graph.nodes)
      .enter()
      .append('g')
      .attr('class', 'node');

    node
      .append('circle')
      .attr('r', d => {
        return d['weight'] / 5;
      })
      .attr('fill', d => {
        return this.colorArr.filter(color => color.key === Math.floor(d['age'] / 10))[0].value;
      });

    const text = node
      .selectAll('text')
      .data(graph.nodes)
      .enter()
      .append('text')
      .text(d => d['name'])
      .attr('fill', '#000')
      .attr('font-size', 14);
    // .style('text-anchor', 'middle');

    svg.selectAll('circle').call(
      d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    );

    force.nodes(graph.nodes);
    // force.force('link')
    //   .links(graph.links);

    force.nodes(graph.nodes).on('tick', ticked);

    force.force<d3.ForceLink<any, any>>('link').links(graph.links);

    function ticked() {
      link
        .attr('x1', function(d: any) {
          return d.source.x;
        })
        .attr('y1', function(d: any) {
          return d.source.y;
        })
        .attr('x2', function(d: any) {
          return d.target.x;
        })
        .attr('y2', function(d: any) {
          return d.target.y;
        });

      node
        .attr('cx', function(d: any) {
          return d.x;
        })
        .attr('cy', function(d: any) {
          return d.y;
        });
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
