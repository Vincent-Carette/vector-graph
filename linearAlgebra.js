function multiplyVectorByScalar(vector, scalar) {
    let newVector = []

    for (let i = 0; i < vector.length; i++) {
        let v = vector[i]
        newVector.push(v * scalar)
    }
    return newVector
}

function addVectors(vector, other) {
    let newVector = []

    for (let i = 0; i < vector.length; i++) {
        newVector.push(vector[i] + other[i])
    }
    return newVector
}

class Matrix {
    constructor(rows, columns) {
        this.values = []
        this.rows = rows
        this.columns = columns
        for (let i = 0; i < rows * columns; i++) {
            this.values.push(0)
        }
    }

    static convertColumnsToValues(columns) {
        let toReturn = []
        let rows = columns[0].length

        for (let i = 0; i < rows; i++) {
            for (let k = 0; k < columns.length; k++) {
                toReturn.push(columns[k][i])
            }
        }
        return toReturn
    }

    addValues(vals) {
        if (vals.length != this.rows * this.columns) {
            alert("Invalid values: length not equal to rows * columns")
        } else {
            this.values = vals
        }
    }

    toString() {
        let toReturn = ""
        for (let i = 0; i < this.values.length; i++) {
            if (i != 0 && (i % this.columns == 0 || this.columns == 1)) {
                toReturn += "\n"
            }
            toReturn += this.values[i] + "     "
        }
        return toReturn
    }

    getColumns() {
        let toReturn = []
        for (let i = 0; i < this.columns; i++) {
            let newColumn = []
            for (let k = 0; k < this.values.length; k++) {
                if (k % this.columns == i) {
                    newColumn.push(this.values[k])
                }
            }
            toReturn.push(newColumn)
        }
        return toReturn
    }

    getRows() {
        let toReturn = [[]]
        let currentEditing = 0
        for (let i = 0; i < this.values.length; i++) {
            if (i % this.columns == 0 && i != 0) {
                toReturn.push([])
                currentEditing++
            }
            toReturn[currentEditing].push(this.values[i])
        }
        return toReturn
    }

    multiply(other) {
        if (other.rows != this.columns) {
            alert("Multiplication failed: columns not equal to other matrix's rows.")
            return
        }
        let newMat = new Matrix(this.rows, other.columns)
        let otherColumns = this.getColumns()
        let thisColumns = other.getColumns()
        let newValues = []
        let newColumns = []

        for (let i = 0; i < thisColumns.length; i++) {
            let v = thisColumns[i]
            let newVector = []

            for (let k = 0; k < v.length; k++) {
                let o = v[k]
                if (newVector.length == 0) {
                    newVector = multiplyVectorByScalar(otherColumns[k], o)
                } else {
                    newVector = addVectors(newVector, multiplyVectorByScalar(otherColumns[k], o))
                }
            }
            newColumns.push(newVector)
        }
        newMat.addValues(Matrix.convertColumnsToValues(newColumns))
        return newMat
    }
}