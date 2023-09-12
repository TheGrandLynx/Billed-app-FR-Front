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
import BillsUI from "../views/BillsUI.js";

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
		window.localStorage.setItem('user', JSON.stringify(
			{
				type: 'Employee'
			}
		))
      
      	const html = NewBillUI()
      	document.body.innerHTML = html

		const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
		const store = mockStore

		const newBill = new NewBill({document, onNavigate, store,	localStorage,})
		const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
		const file = screen.getByTestId("file")
		file.addEventListener("change", handleChangeFile)
				fireEvent.change(file, {
					target: {
						files: [new File(["file.png"], "file.png", { type: "image/png" })],
					},
				})

		jest.spyOn(window, "alert")
		expect(alert).not.toHaveBeenCalled()
		expect(handleChangeFile).toHaveBeenCalled()
		expect(file.files[0].name).toBe("file.png")
	})
    
    
  })
  describe("When I am on NewBill Page and the user upload an unaccepted format file", () => {
    test("Then the file name should should  displayed in the input", async () => {
		window.localStorage.setItem('user', JSON.stringify(
			{
				type: 'Employee'
			}
		))
      
		const html = NewBillUI()
		document.body.innerHTML = html      
		//to-do write assertion

		const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
		const store = mockStore

		const newBill = new NewBill({document, onNavigate, store,	localStorage,})
		const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
		const file = screen.getByTestId("file")

		file.addEventListener("change", handleChangeFile)
		fireEvent.change(file, {
			target: {
				files: [new File(["file.pdf"], "file.pdf", { type: "file/pdf" })],
			},
		})

		jest.spyOn(window, "alert")
		expect(alert).toHaveBeenCalled()
			
		expect(handleChangeFile).toHaveBeenCalled() 		
		expect(file.files[0].name).not.toMatch(/(jpeg|jpg|png)/);
		expect(file.value).toBe('')
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
			
			const store = mockStore
	
			const newBill = new NewBill({ document, onNavigate, store, localStorage });  
	
			const formNewBill = screen.getByTestId("form-new-bill");
			const handleSubmit = jest.fn(newBill.handleSubmit);
			formNewBill.addEventListener("submit", handleSubmit);
			fireEvent.submit(formNewBill);
	
			expect(handleSubmit).toHaveBeenCalled();  
      })
  })


//Integration test POST
	describe("When I post a newBill", () => {
		test("Add a new bill POST", async () => {
			Object.defineProperty(window, "localStorage", {
				value: localStorageMock,
				});
			window.localStorage.setItem(
				"user",
				JSON.stringify({
					type: "Employee",
					email: "employee@company.tld",
				})
			);

			const html = NewBillUI()
			document.body.innerHTML = html
	
			const inputData = {
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
		
			const inputType = screen.getByTestId("expense-type");
			fireEvent.change(inputType, { target: { value: inputData.type } });
			expect(inputType.value).toBe(inputData.type);
	
			const inputName = screen.getByTestId("expense-name");
			fireEvent.change(inputName, { target: { value: inputData.name } });
			expect(inputName.value).toBe(inputData.name);
	
			const inputDate = screen.getByTestId("datepicker");
			fireEvent.change(inputDate, { target: { value: inputData.date } });
			expect(inputDate.value).toBe(inputData.date);
	
			const inputAmount = screen.getByTestId("amount");
			fireEvent.change(inputAmount, { target: { value: inputData.amount } });
			expect(parseInt(inputAmount.value)).toBe(inputData.amount);
	
			const inputVat = screen.getByTestId("vat");
			fireEvent.change(inputVat, { target: { value: inputData.vat } });
			expect(inputVat.value).toBe(inputData.vat);
	
			const inputPct = screen.getByTestId("pct");
			fireEvent.change(inputPct, { target: { value: inputData.pct } });
			expect(parseInt(inputPct.value)).toBe(inputData.pct);
	
			const inputCommentary = screen.getByTestId("commentary");
			fireEvent.change(inputCommentary, {
				target: { value: inputData.commentary },
			});
			expect(inputCommentary.value).toBe(inputData.commentary);
		
			const onNavigate = (pathname) => {
			document.body.innerHTML = ROUTES({ pathname });
			};
	
			const store = null;
	
			const newBill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage,
			});
		
			const getlocalStorage = localStorage.getItem("user");
			const localStorageparse = JSON.parse(getlocalStorage);
			const email = JSON.parse(localStorageparse).email;
		
			const mocked = mockStore.bills();
			const updateBill = jest.spyOn(mocked, "update");
		
			const update = await updateBill({ email, ...inputData });
			const formNewBill = screen.getByTestId("form-new-bill");
			const handleSubmit = jest.fn(newBill.handleSubmit);
		
			formNewBill.addEventListener("submit", handleSubmit);
			fireEvent.submit(formNewBill);
		
			expect(update.id).toBe("47qAXb6fIm2zOKkLzMro");
			expect(update.email).toBe("a@a");
	
			expect(handleSubmit).toHaveBeenCalled();
			expect(updateBill).toHaveBeenCalled();
			expect(formNewBill).toBeTruthy();
		});
		
		describe("When an error occurs on API", () => {
			beforeEach(() => {
				jest.spyOn(mockStore, "bills");
				Object.defineProperty(window, "localStorage", {
					value: localStorageMock,
			  	});
				window.localStorage.setItem(
					"user",
					JSON.stringify({
					type: "Employee",
					email: "a@a",
					})
				);
				const root = document.createElement("div");
				root.setAttribute("id", "root");
				document.body.appendChild(root);
				router();
			});
		
			test("fetches bills from an API and fails with 404 message error", async () => {
			  	mockStore.bills.mockImplementationOnce(() => {
					return {
						list: () => {
							return Promise.reject(new Error("Erreur 404"));
						},
					};
			  	});
				window.onNavigate(ROUTES_PATH.NewBill);
				await new Promise(process.nextTick);
				document.body.innerHTML = BillsUI({ error: "Erreur 404" });
				const message = screen.getByText(/Erreur 404/);
				expect(message).toBeTruthy();
			});
		
			test("fetches messages from an API and fails with 500 message error", async () => {
				mockStore.bills.mockImplementationOnce(() => {
					return {
						list: () => {
							return Promise.reject(new Error("Erreur 500"));
						},
					};
			  	});
				window.onNavigate(ROUTES_PATH.NewBill);
				await new Promise(process.nextTick);
				document.body.innerHTML = BillsUI({ error: "Erreur 500" });
				const message = screen.getByText(/Erreur 500/);
				expect(message).toBeTruthy();
			});
		});
	});	
})
