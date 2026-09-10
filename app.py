import tkinter as tk
from tkinter import messagebox

expenses = []


def add_expense():
    name = name_entry.get().strip()
    amount_text = amount_entry.get().strip()

    if not name or not amount_text:
        messagebox.showwarning("Missing data", "Please enter both the name and amount.")
        return

    try:
        amount = float(amount_text)
    except ValueError:
        messagebox.showerror("Invalid amount", "Please enter a valid number.")
        return

    expenses.append((name, amount))
    name_entry.delete(0, tk.END)
    amount_entry.delete(0, tk.END)
    update_total()
    messagebox.showinfo("Success", "Expense added successfully!")


def update_total():
    total = sum(amount for _, amount in expenses)
    total_label.config(text=f"Total: {total}")


root = tk.Tk()
root.title("Expense Tracker")
root.geometry("350x250")
root.resizable(False, False)

frame = tk.Frame(root, padx=20, pady=20)
frame.pack(fill="both", expand=True)

label1 = tk.Label(frame, text="Expense Name")
label1.pack(anchor="w")
name_entry = tk.Entry(frame, width=30)
name_entry.pack(pady=(0, 10))

label2 = tk.Label(frame, text="Amount")
label2.pack(anchor="w")
amount_entry = tk.Entry(frame, width=30)
amount_entry.pack(pady=(0, 10))

add_button = tk.Button(frame, text="Add Expense", command=add_expense)
add_button.pack(fill="x", pady=(0, 10))

total_label = tk.Label(frame, text="Total: 0", font=("Arial", 12, "bold"))
total_label.pack(anchor="w")

root.mainloop()
