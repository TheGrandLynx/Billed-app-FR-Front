/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { bills } from "../fixtures/bills"
import router from "../app/Router.js"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
			const isIconActivated = windowIcon.classList.contains("active-icon")
      expect(isIconActivated).toBeTruthy()
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

//Unit tests

describe("Given I am connected as Employee and I am on Bill page, there are bills", () => {
	describe("When i click on an eye icon", () => {
		test("Then a modal should open, have a title and a file url", () => {
			Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
			document.body.innerHTML = BillsUI({ data: bills })
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname })
			}
			const billsContainer = new Bills({document, onNavigate,	store: null, localStorage: window.localStorage,})

			const modale = document.getElementById("modaleFile")
			$.fn.modal = jest.fn(() => modale.classList.add("show"))

			const iconsEye = screen.getAllByTestId("icon-eye")[0]
			const handleClickIconEye = jest.fn(billsContainer.handleClickIconEye(iconsEye))

			iconsEye.addEventListener("click", handleClickIconEye)
			userEvent.click(iconsEye)
			expect(handleClickIconEye).toHaveBeenCalled()
			expect(modale.classList).toContain("show")
			expect(screen.getByText("Justificatif")).toBeTruthy()
			expect(bills[0].fileUrl).toBeTruthy()
		})
	})

  describe("When I click on the New Bill button", () => {
    test("Then the New Bill page should open", async () => {
      const onNavigate = pathname => { document.body.innerHTML = ROUTES({ pathname }) }
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const billsContainer = new Bills({ document, onNavigate, store: null, localStorage: window.localStorage })
      document.body.innerHTML = BillsUI({ data: bills })

      const btnNewBill = await screen.getByTestId("btn-new-bill")
      const handleClickNewBill = jest.fn(() => billsContainer.handleClickNewBill)
      btnNewBill.addEventListener("click", handleClickNewBill)

      userEvent.click(btnNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
    })
  })
})


//Integration Test
describe("Given I am connected as an employee", () => {
  describe("When i navigate to  Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
			window.onNavigate(ROUTES_PATH.Bills)
			expect(screen.getAllByText("Billed")).toBeTruthy()
			expect(await waitFor(() => screen.getByText("Mes notes de frais"))).toBeTruthy()
			expect(screen.getByTestId("tbody")).toBeTruthy()
			expect(screen.getAllByText("test1")).toBeTruthy()
    })
  })

  describe("When an error occurs on API", () => {
    beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Admin',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
    })

    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
				return {
					list: () => {
						return Promise.reject(new Error("Erreur 404"))
					},
				}
			})
			window.onNavigate(ROUTES_PATH.Bills)
			await new Promise(process.nextTick)
			const message = await screen.getByText(/Erreur 404/)
			expect(message).toBeTruthy()
    })
    
    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return { list: () => { return Promise.reject(new Error("Erreur 500")) }}
      })

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick)
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})