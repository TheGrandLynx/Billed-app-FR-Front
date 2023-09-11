/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js"
import router from "../app/Router.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {
			Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
			const root = document.createElement("div")
			root.setAttribute("id", "root")
			document.body.append(root)
			router()
			window.onNavigate(ROUTES_PATH.NewBill)
			await waitFor(() => screen.getByTestId("icon-mail"))
			const windowIcon = screen.getByTestId("icon-mail")
			const isIconActivated = windowIcon.classList.contains("active-icon")
			expect(isIconActivated).toBeTruthy()
		})
    test("Then the form should be rendered correctly", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const formNewBill = screen.getByTestId("form-new-bill")
			const txtType = screen.getAllByTestId("expense-type")
			const txtName = screen.getAllByTestId("expense-name")
			const txtDate = screen.getAllByTestId("datepicker")
			const txtAmount = screen.getAllByTestId("amount")
			const txtVat = screen.getAllByTestId("vat")
			const txtPct = screen.getAllByTestId("pct")
			const txtaCommentary = screen.getAllByTestId("commentary")
			const btnfile = screen.getAllByTestId("file")
			const btnSubmit = document.querySelector("#btn-send-bill")

			expect(formNewBill).toBeTruthy()
			expect(txtType).toBeTruthy()
			expect(txtName).toBeTruthy()
			expect(txtDate).toBeTruthy()
			expect(txtAmount).toBeTruthy()
			expect(txtVat).toBeTruthy()
			expect(txtPct).toBeTruthy()
			expect(txtaCommentary).toBeTruthy()
			expect(btnfile).toBeTruthy()
			expect(btnSubmit).toBeTruthy()

			expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
  })
  describe("When I am on NewBill Page and the user upload accepted format file", () => {
    test("Then the file name should be correctly displayed in the input", async () => {
			window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      
      	const html = NewBillUI()
      	document.body.innerHTML = html

		const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
		const store = mockStore

		const newBill = new NewBill({document, onNavigate, store,	localStorage,})
		//console.log(newBill)
		const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
		const file = screen.getByTestId("file")

		window.alert = jest.fn()

		file.addEventListener("change", handleChangeFile)
				fireEvent.change(file, {
					target: {
						files: [new File(["file.png"], "file.png", { type: "image/png" })],
					},
				})
				console.log(newBill)


				jest.spyOn(window, "alert")
				expect(alert).not.toHaveBeenCalled()

				expect(handleChangeFile).toHaveBeenCalled()
				console.log(file.files[0].name)
				expect(file.files[0].name).toBe("file.png")
				//console.log(file.files)
				expect(newBill.formData).not.toBe(null)
				expect(newBill.fileName).toBe("file.png")

		})
    
    
  })
  describe("When I am on NewBill Page and the user upload an unaccepted format file", () => {
    test("Then the file name should be correctly displayed in the input", async () => {
			window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      
      const html = NewBillUI()
      document.body.innerHTML = html      
      //to-do write assertion

			const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
			const store = mockStore

			const newBill = new NewBill({document, onNavigate, store,	localStorage,})
			const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
			const file = screen.getByTestId("file")

			window.alert = jest.fn()

      file.addEventListener("change", handleChangeFile)
			fireEvent.change(file, {
				target: {
					files: [new File(["file.pdf"], "file.pdf", { type: "file/pdf" })],
				},
			})

			jest.spyOn(window, "alert")
      expect(alert).toHaveBeenCalled()
			
			expect(handleChangeFile).toHaveBeenCalled()
			expect(newBill.fileName).toBe(null)
			expect(newBill.formData).toBe(undefined)      

		})
  })
    describe("When I am on NewBill Page and the user submit a new bill by clicking on the 'Envoyer' button", () => {
      test("Then the handleSubmit function should be called", async () => {
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        
        const html = NewBillUI()
        document.body.innerHTML = html      
        //to-do write assertion
  
        const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
        /* const store = {
          bills: jest.fn(() => newBill.store),
          create: jest.fn(() => Promise.resolve({})),
        }; */
        const store = mockStore
  
        const newBill = new NewBill({ document, onNavigate, store, localStorage });  
  
        const formNewBill = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn(newBill.handleSubmit);
        formNewBill.addEventListener("submit", handleSubmit);
        fireEvent.submit(formNewBill);
  
        expect(handleSubmit).toHaveBeenCalled();
  
      })
  })
})


describe("When I navigate to Dashboard employee", () => {
	describe("Given I am a user connected as Employee, and a user post a newBill", () => {
		test("Add a bill from mock API POST", async () => {
			const postSpy = jest.spyOn(mockStore, "bills");
			const bill = {
				id: "47qAXb6fIm2zOKkLzMro",
				vat: "80",
				fileUrl: "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
				status: "pending",
				type: "Hôtel et logement",
				commentary: "séminaire billed",
				name: "encore",
				fileName: "preview-facture-free-201801-pdf-1.jpg",
				date: "2004-04-04",
				amount: 400,
				commentAdmin: "ok",
				email: "a@a",
				pct: 20,
			};
			const postBills = await mockStore.bills().update(bill);
			expect(postSpy).toHaveBeenCalledTimes(1);
			expect(postBills).toStrictEqual(bill);
		});
		describe("When an error occurs on API", () => {
			beforeEach(() => {
				window.localStorage.setItem(
					"user",
					JSON.stringify({
						type: "Employee",
					})
				);

				document.body.innerHTML = NewBillUI();

				const onNavigate = (pathname) => {
					document.body.innerHTML = ROUTES({ pathname });
				};
			});
			test("Add bills from an API and fails with 404 message error", async () => {
				const postSpy = jest.spyOn(console, "error");

				const store = {
					bills: jest.fn(() => newBill.store),
					create: jest.fn(() => Promise.resolve({})),
					update: jest.fn(() => Promise.reject(new Error("404"))),
				};

				const newBill = new NewBill({ document, onNavigate, store, localStorage });
				newBill.isImgFormatValid = true;

				// Submit form
				const form = screen.getByTestId("form-new-bill");
				const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
				form.addEventListener("submit", handleSubmit);

				fireEvent.submit(form);
				await new Promise(process.nextTick);
				expect(postSpy).toBeCalledWith(new Error("404"));
			});
			test("Add bills from an API and fails with 500 message error", async () => {
				const postSpy = jest.spyOn(console, "error");

				const store = {
					bills: jest.fn(() => newBill.store),
					create: jest.fn(() => Promise.resolve({})),
					update: jest.fn(() => Promise.reject(new Error("500"))),
				};

				const newBill = new NewBill({ document, onNavigate, store, localStorage });
				newBill.isImgFormatValid = true;

				// Submit form
				const form = screen.getByTestId("form-new-bill");
				const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
				form.addEventListener("submit", handleSubmit);

				fireEvent.submit(form);
				await new Promise(process.nextTick);
				expect(postSpy).toBeCalledWith(new Error("500"));
			});
		});
	});
});