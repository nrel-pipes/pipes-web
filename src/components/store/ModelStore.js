import { create } from "zustand";
import origin from "./OriginSetup";


export const useModelStore = create((set, get) => ({
  models: [],
  runs: {},
  numCheckIns: {},
  numCheckInsByScenario: {},
  completedHandoffs: {},
  lastCheckIn: {},

  reset: () => {
    set({
      models: [],
      runs: {},
      numCheckIns: {},
      numCheckInsByScenario: {},
      completedHandoffs: {},
    });
 },

  resetRuns: () => {
    set({ runs: {} });
  },

  fetchModelRuns: async (projectName, projectRunName, modelName) => {
    try {
      const modelContext = new URLSearchParams({
        project: projectName,
        projectrun: projectRunName,
        model: modelName
      })
      const mrUrl = new URL(`api/modelruns/?${modelContext}`, origin).href;
      const response = await fetch(mrUrl,{
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({runs: data});
      }
    } catch (error) {
      console.log("Failed to fetch projects from the server.")
    }
  },
  fetch: async (projectName, projectRunName) => {
    try {
      const projectRunContext = new URLSearchParams({
        project: projectName,
        projectrun: projectRunName
      })
      const mUrl = new URL(`api/models/?${projectRunContext}`, origin).href;
      const response = await fetch(mUrl,{
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({models: data});
      }
    } catch (error) {
      console.log("Failed to fetch projects from the server.")
    }
  },
}));

export const useModelStoreV1 = create((set) => ({
  models: [
    {
      name: "Residential",
      id: 3,
      type: "Building Loads",
      expected_scenarios: ["demand_high", "demand_stress", "demand_moderate"],
      requirements: [
        {
          name: "geographic_extent",
          value: "Los Angeles",
        },
        {
          name: "weather_years",
          value: [2012],
        },
      ],
      users: [
        {
          first: "David",
          last: "Rager",
          email: "David.Rager@nrel.gov",
        },
      ],
      last: "02/14/2020",
      checkins: 9,
      expected_handoffs: {
        demand_high: 3,
        demand_stress: 3,
        demand_moderate: 3,
      },
      completed_handoffs: [
        {
          scenario: "demand_moderate",
          value: 3,
        },
        {
          scenario: "demand_high",
          value: 3,
        },
        {
          scenario: "demand_stress",
          value: 3,
        },
      ],
      scenario_mapping: [
        {
          model_scenario: "demand_moderate",
          project_scenarios: [
            "sb100_moderate",
            "earlynobio_moderate",
            "trans_moderate",
            "ltdnewtrans_moderate",
          ],
        },
        {
          model_scenario: "demand_high",
          project_scenarios: [
            "sb100_high",
            "earlynobio_high",
            "trans_high",
            "ltdnewtrans_high",
          ],
        },
        {
          model_scenario: "demand_stress",
          project_scenarios: ["sb100_stress"],
        },
      ],
    },
    {
      name: "Commercial",
      id: 3,
      type: "Building Loads",
      expected_scenarios: ["demand_high", "demand_stress", "demand_moderate"],
      requirements: [
        {
          name: "geographic_extent",
          value: "Los Angeles",
        },
        {
          name: "weather_years",
          value: [2012],
        },
      ],
      users: [
        {
          first: "Kenny",
          last: "Gruchalla",
          email: "Kenny.Gruchalla@nrel.gov",
        },
      ],
      last: "02/14/2020",
      checkins: 9,
      expected_handoffs: {
        demand_high: 3,
        demand_stress: 3,
        demand_moderate: 3,
      },
      completed_handoffs: [
        {
          scenario: "demand_moderate",
          value: 3,
        },
        {
          scenario: "demand_high",
          value: 3,
        },
        {
          scenario: "demand_stress",
          value: 3,
        },
      ],
      scenario_mapping: [
        {
          model_scenario: "demand_moderate",
          project_scenarios: [
            "sb100_moderate",
            "earlynobio_moderate",
            "trans_moderate",
            "ltdnewtrans_moderate",
          ],
        },
        {
          model_scenario: "demand_high",
          project_scenarios: [
            "sb100_high",
            "earlynobio_high",
            "trans_high",
            "ltdnewtrans_high",
          ],
        },
        {
          model_scenario: "demand_stress",
          project_scenarios: ["sb100_stress"],
        },
      ],
    },
    {
      name: "dsgrid",
      id: 3,
      type: "dsgrid",
      expected_scenarios: ["demand_high", "demand_stress", "demand_moderate"],
      users: [
        {
          first: "Sam",
          last: "Molnar",
          email: "sam.molnar@nrel.gov",
        },
        {
          first: "Meghan",
          last: "Mooney",
          email: "Meghan.Mooney@nrel.gov",
        },
      ],
      requirements: [
        {
          name: "geographic_extent",
          value: "RS-A",
        },
      ],
      last: "03/07/2020",
      checkins: 9,
      expected_handoffs: {
        demand_high: 3,
        demand_stress: 3,
        demand_moderate: 3,
      },
      completed_handoffs: [
        {
          scenario: "demand_moderate",
          value: 3,
        },
        {
          scenario: "demand_high",
          value: 3,
        },
        {
          scenario: "demand_stress",
          value: 3,
        },
      ],
      scenario_mapping: [
        {
          model_scenario: "demand_moderate",
          project_scenarios: [
            "sb100_moderate",
            "earlynobio_moderate",
            "trans_moderate",
            "ltdnewtrans_moderate",
          ],
        },
        {
          model_scenario: "demand_high",
          project_scenarios: [
            "sb100_high",
            "earlynobio_high",
            "trans_high",
            "ltdnewtrans_high",
          ],
        },
        {
          model_scenario: "demand_stress",
          project_scenarios: ["sb100_stress"],
        },
      ],
    },
    {
      name: "dgen",
      id: 4,
      type: "Distributed Generation",
      expected_scenarios: [
        "sb100_moderate",
        "sb100_high",
        "sb100_stress",
        "earlynobio_high",
        "earlynobio_moderate",
        "trans_high",
        "trans_moderate",
      ],
      requirements: [
        {
          name: "geographic_extent",
          value: "RS-A",
        },
      ],
      users: [
        {
          first: "Jianli",
          last: "Gu",
          email: "Jianli.Gu@nrel.gov",
        },
        {
          first: "Jacob",
          last: "Nunemaker",
          email: "Jacob.Nunemaker@nrel.gov",
        },
      ],
      last: "11/01/2022",
      checkins: 37,
      expected_handoffs: {
        sb100_moderate: 3,
        sb100_high: 3,
        sb100_stress: 3,
        earlynobio_high: 3,
        earlynobio_moderate: 3,
        trans_high: 3,
        trans_moderate: 3,
      },
      completed_handoffs: [
        {
          scenario: "sb100_moderate",
          value: 2,
        },
        {
          scenario: "sb100_high",
          value: 2,
        },
        {
          scenario: "sb100_stress",
          value: 2,
        },
        {
          scenario: "earlynobio_moderate",
          value: 2,
        },
        {
          scenario: "earlynobio_high",
          value: 2,
        },
        {
          scenario: "trans_hi",
          value: 1,
        },
        {
          scenario: "trans_moderate",
          value: 1,
        },
      ],
      scenario_mapping: [
        {
          model_scenario: "sb100_moderate",
          project_scenarios: ["sb100_moderate"],
        },
        {
          model_scenario: "sb100_high",
          project_scenarios: ["sb100_high"],
        },
        {
          model_scenario: "sb100_stress",
          project_scenarios: ["sb100_stress"],
        },
        {
          model_scenario: "earlynobio_moderate",
          project_scenarios: ["earlynobio_moderate"],
        },
        {
          model_scenario: "earlynobio_high",
          project_scenarios: ["earlynobio_high"],
        },
        {
          model_scenario: "trans_moderate",
          project_scenarios: ["trans_moderate"],
        },
        {
          model_scenario: "trans_high",
          project_scenarios: ["trans_high"],
        },
        {
          model_scenario: "sb100_moderate",
          project_scenarios: ["ltdnewtrans_moderate"],
        },
        {
          model_scenario: "sb100_high",
          project_scenarios: ["ltdnewtrans_high"],
        },
      ],
    },
    {
      name: "rpm",
      id: 5,
      type: "Capacity Expansion",
      expected_scenarios: ["sb100_high"],
      requirements: [
        {
          name: "geographic_extent",
          value: "WECC",
        },
        {
          name: "weather_years",
          value: [2012],
        },
      ],
      users: [
        {
          first: "David",
          last: "Rager",
          email: "David.Rager@nrel.gov",
        },
      ],
      last: "11/15/2022",
      checkins: 142,
      expected_handoffs: {
        sb100_moderate: 3,
        sb100_high: 3,
        sb100_stress: 3,
        earlynobio_high: 3,
        earlynobio_moderate: 3,
        trans_high: 3,
        trans_moderate: 3,
      },
      completed_handoffs: [
        {
          scenario: "sb100_moderate",
          value: 2,
        },
        {
          scenario: "sb100_high",
          value: 2,
        },
        {
          scenario: "sb100_stress",
          value: 2,
        },
        {
          scenario: "earlynobio_moderate",
          value: 1,
        },
        {
          scenario: "earlynobio_high",
          value: 1,
        },
        {
          scenario: "trans_hi",
          value: 1,
        },
        {
          scenario: "trans_moderate",
          value: 1,
        },
      ],
      scenario_mapping: [
        {
          model_scenario: "sb100_moderate",
          project_scenarios: ["sb100_moderate"],
        },
        {
          model_scenario: "sb100_high",
          project_scenarios: ["sb100_high"],
        },
        {
          model_scenario: "sb100_stress",
          project_scenarios: ["sb100_stress"],
        },
        {
          model_scenario: "earlynobio_moderate",
          project_scenarios: ["earlynobio_moderate"],
        },
        {
          model_scenario: "earlynobio_high",
          project_scenarios: ["earlynobio_high"],
        },
        {
          model_scenario: "trans_moderate",
          project_scenarios: ["trans_moderate"],
        },
        {
          model_scenario: "trans_high",
          project_scenarios: ["trans_high"],
        },
        {
          model_scenario: "ltdnewtrans_moderate",
          project_scenarios: ["ltdnewtrans_moderate"],
        },
        {
          model_scenario: "ltdnewtrans_high",
          project_scenarios: ["ltdnewtrans_high"],
        },
      ],
    },
  ],
}));
